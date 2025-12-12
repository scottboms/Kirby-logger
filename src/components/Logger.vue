<template>
	<k-panel-inside>
		<k-view class="k-logger">
			<k-header class="k-site-view-header">
				Log Viewer

				<template #buttons>
					<k-button-group>
						<k-button
							icon="copy"
							size="xs"
							variant="filled"
							theme="blue-icon"
							style="margin-left: .5rem"
							@click="copy"
							:disabled="loading || !content"
						>
							Copy
						</k-button>

						<k-button
							icon="refresh"
							size="xs"
							variant="filled"
							@click="fetchTail"
							:disabled="loading"
							responsive="true"
						>
							Refresh
						</k-button>

						<k-button
							:icon="auto ? 'refresh-stop' : 'refresh-auto'"
							size="xs"
							variant="filled"
							:theme="auto ? 'red' : 'green'"
							@click="toggleAuto"
							responsive="true"
						>
							{{ auto ? "Stop" : "Auto-Refresh" }}
						</k-button>
					</k-button-group>
				</template>
			</k-header>

			<k-section label="Log" style="margin-bottom: 1rem">
				<template #options>
					<k-button-group>
						<k-number-field
							:model-value="lines"
							:min="10"
							:max="2000"
							after="Lines"
							width="1/3"
							@update:modelValue="onLinesChange"
						/>

						<k-button
							icon="check"
							size="lg"
							variant="filled"
							@click="fetchTail"
							:disabled="loading"
						>
							Apply
						</k-button>
					</k-button-group>
				</template>
			</k-section>

			<k-box theme="passive">
				<div
					style="font-family: var(--font-mono); font-size: var(--text-md); line-height: var(--height-md); max-height: calc(100vh - 360px); overflow: auto; white-space: pre; width: 100%;"
				>
					<template v-if="loading">Loading...</template>
					<template v-else-if="content">{{ content }}</template>
					<template v-else>No log content</template>
				</div>
			</k-box>
		</k-view>
	</k-panel-inside>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
	name: "Logger",

	props: {
		title: String,
		tailEndpoint: {
			type: String,
			required: true,
		},
		defaultLines: {
			type: Number,
			default: 400,
		},
		filename: String,
	},

	data() {
		return {
			content: "",
			lines: this.defaultLines,
			loading: false,
			auto: false,
			timer: null,
		};
	},

	// In Panel views, mounted is often a bit more predictable than created.
	mounted() {
		this.fetchTail();
	},

	beforeUnmount() {
		this.stopAuto();
	},

	methods: {
		onLinesChange(val) {
			this.lines = Number(val);
		},

		notify(kind, msg) {
			const api = this.$panel && (this.$panel.notifications || this.$panel.notification);
			if (api && typeof api[kind] === "function") {
				api[kind](msg);
				return;
			}
			console.warn("Notification:", kind, msg);
		},

		async fetchTail() {
			if (!this.tailEndpoint) {
				this.notify("error", "Missing tail endpoint");
				return;
			}

			try {
				this.loading = true;
				const res = await this.$api.get(this.tailEndpoint, { lines: this.lines });
				this.content = res?.content ?? "";
			} catch (e) {
				this.notify("error", e?.message || "Failed to load log file");
			} finally {
				this.loading = false;
			}
		},

		startAuto() {
			if (this.timer) return;
			this.timer = setInterval(() => this.fetchTail(), 5000);
		},

		stopAuto() {
			if (!this.timer) return;
			clearInterval(this.timer);
			this.timer = null;
		},

		toggleAuto() {
			this.auto = !this.auto;
			if (this.auto) this.startAuto();
			else this.stopAuto();
		},

		async copy() {
			if (!this.content) {
				this.notify("error", "Nothing to copy");
				return;
			}

			try {
				if (navigator.clipboard?.writeText) {
					await navigator.clipboard.writeText(this.content);
				} else if (this.$panel && typeof this.$panel.copy === "function") {
					await this.$panel.copy(this.content);
				} else if (typeof this.$copy === "function") {
					await this.$copy(this.content);
				} else {
					const ta = document.createElement("textarea");
					ta.value = this.content;
					ta.setAttribute("readonly", "");
					ta.style.position = "fixed";
					ta.style.top = "-9999px";
					document.body.appendChild(ta);
					ta.select();
					document.execCommand("copy");
					document.body.removeChild(ta);
				}

				this.notify("success", "Log copied");
			} catch (e) {
				this.notify("error", e?.message || "Copy failed");
			}
		},
	},
});
</script>
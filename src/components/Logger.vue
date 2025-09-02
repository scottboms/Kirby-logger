<template>
	<k-panel-inside>
		<k-view class="k-logger">
			<k-header class="k-site-view-header">
        Log Viewer
        <k-button-group slot="buttons">
					<k-button
						icon="copy"
						size="xs"
						variant="filled"
						theme="blue-icon"
						style="margin-left: .5rem"
						@click="copy"
						:disabled="loading || !content"
					>Copy</k-button>

					<k-button
						icon="refresh"
						size="xs"
						variant="filled"
						@click="fetchTail"
						:disabled="loading"
						responsive="true"
					>Refresh</k-button>

					<k-button
						:icon="auto ? 'refresh-stop' : 'refresh-auto'"
						size="xs"
						variant="filled"
						:theme="auto ? 'red' : 'green'"
						@click="toggleAuto"
						responsive="true"
					>{{ auto ? 'Stop' : 'Auto-Refresh' }}</k-button>
				</k-button-group>
			</k-header>

			<k-section label="Log" style="margin-bottom: 1rem">
				<k-button-group slot="options">
						<k-number-field
							:value="lines"
							:min="10"
							:max="2000"
							after="Lines"
							width="1/3"
							@input="val => lines = Number(val)"
						/>

					<k-button icon="check" size="lg" variant="filled" @click="fetchTail" :disabled="loading">Apply</k-button>
				</k-button-group>
			</k-section>

			<k-box theme="passive">
				<div style="font-family: var(--font-mono); font-size: var(--text-md); line-height: var(--height-md); max-height: calc(100vh - 360px); overflow: auto; white-space: pre; width: 100%;">
					<template v-if="loading">Loading...</template>
					<template v-else-if="content">{{ content }}</template>
					<template v-else>No log content</template>
				</div>
			</k-box>

		</k-view>
	</k-panel-inside>
</template>

<script>
export default {
	name: 'Logger',
	props: {
		title: String,
		tailEndpoint: String, // e.g. /logger/tail (api route)
		defaultLines: Number,
		filename: String,
	},

	data() {
		return {
			content: '',
			lines: this.defaultLines || 400,
			loading: false,
			auto: false,
			timer: null,
		};
	},

	created() {
		this.fetchTail();
	},

	beforeDestroy() {
		if (this.timer) clearInterval(this.timer);
	},

	methods: {
		notify(kind, msg) {
			const api = this.$panel && (this.$panel.notifications || this.$panel.notification);
			if (api && typeof api[kind] === 'function') {
				api[kind](msg);
				return;
			}
			console.warn('Notification:', kind, msg); // fallback
		},

		async fetchTail() {
			try {
				this.loading = true;
				const res = await this.$api.get(this.tailEndpoint, { lines: this.lines });
				this.content = (res && res.content) ? res.content : '';
			} catch (e) {
				this.notify('error', e.message || 'Failed to load log file');
			} finally {
				this.loading = false;
			}
		},

		toggleAuto() {
			this.auto = !this.auto;
			if (this.auto) {
				this.timer = setInterval(this.fetchTail, 5000);
			} else if (this.timer) {
				clearInterval(this.timer);
				this.timer = null;
			}
		},

		async copy() {
			if (!this.content) {
				this.notify('error', 'Nothing to copy');
				return;
			}

			try {
				// modern clipboard api
				if (navigator.clipboard && navigator.clipboard.writeText) {
					await navigator.clipboard.writeText(this.content);
				}
				// kirby 5 panel helper, if available
				else if (this.$panel && typeof this.$panel.copy === 'function') {
					await this.$panel.copy(this.content);
				}
				// legacy helper sometimes present in older setups
				else if (typeof this.$copy === 'function') {
					await this.$copy(this.content);
				}
				// textarea fallback
				else {
					const ta = document.createElement('textarea');
					ta.value = this.content;
					ta.setAttribute('readonly', '');
					ta.style.position = 'fixed';
					ta.style.top = '-9999px';
					document.body.appendChild(ta);
					ta.select();
					document.execCommand('copy');
					document.body.removeChild(ta);
				}
				this.notify('success', 'Log copied');
			} catch (e) {
				this.notify('error', e?.message || 'Copy failed');
			}
		}

	}
}
</script>

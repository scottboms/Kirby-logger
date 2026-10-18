<template>
  <k-panel-inside>
    <k-view class="k-logger">
      <k-header class="k-site-view-header">
        {{ title || "Log Viewer" }}

        <template #buttons>
          <k-button-group>

          <k-button
            icon="copy"
            size="xs"
            variant="filled"
            theme="blue-icon"
            :disabled="loading || !content"
            @click="copy"
          >Copy</k-button>

          <k-button
            icon="refresh"
            size="xs"
            variant="filled"
            :disabled="loading"
            responsive="true"
            @click="fetchTail"
          >Refresh</k-button>

          <k-button
            :icon="auto ? 'refresh-stop' : 'refresh-auto'"
            size="xs"
            variant="filled"
            :theme="auto ? 'red' : 'green'"
            responsive="true"
            @click="toggleAuto"
          >{{ auto ? 'Stop' : 'Auto-Refresh' }}</k-button>
          </k-button-group>
        </template>
      </k-header>

      <k-section :label="filename || 'Log File'" class="k-logger-section">
        <template #options>
          <k-button-group>
            <k-number-field
              :value="lines"
              :min="10"
              :max="2000"
              after="Lines"
              @input="updateLines"
            />

            <k-button
              icon="check"
              size="lg"
              variant="filled"
              :disabled="loading"
              @click="fetchTail"
            >Apply</k-button>
          </k-button-group>
        </template>
      </k-section>

			<k-box theme="passive" class="k-logger-box">
        <div
          class="k-logger-content"
          role="log"
          aria-label="Log file contents"
        >
          <template v-if="loading && !content">
            Loading…
          </template>

          <template v-else-if="content">
            {{ content }}
          </template>

          <template v-else>
            No log content
          </template>
        </div>
      </k-box>
    </k-view>
  </k-panel-inside>
</template>

<script>
export default {
	name: 'Logger',
	props: {
		title: {
      type: String,
      default: "Log Viewer"
    },
		tailEndpoint: {
      type: String, // e.g. /logger/tail (api route)
      required: true
    },
    defaultLines: {
      type: Number,
      default: 400
    },
    filename: String
  },

  data() {
    return {
      content: '',
      lines: this.defaultLines,
      loading: false,
      auto: false,
      timer: null,
    };
  },

  created() {
    this.fetchTail();
  },

  beforeUnmount() {
    this.stopAuto();
  },

  methods: {
    notify(kind, message) {
      const notifications = this.$panel?.notification;
      if (typeof notifications?.[kind] === "function") {
        notifications[kind](message);
      } else {
        console.warn("Notification:", kind, message);
      }
    },
    
    updateLines(value) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        this.lines = Math.max(10, Math.min(2000, parsed));
      }
    },
    
    async fetchTail() {
      // Prevent overlapping requests
      if (this.loading) {
        return;
      }
      this.loading = true;

      try {
        const response = await this.$api.get(
          this.tailEndpoint,
          { lines: this.lines }
        );

        this.content = response?.content ?? "";
      } catch (error) {
        this.notify(
          "error",
          error?.message || "Failed to load log file"
        );
      } finally {
        this.loading = false;
      }
    },

    toggleAuto() {
      if (this.auto) {
        this.stopAuto();
      } else {
        this.startAuto();
      }
    },

    startAuto() {
      if (this.timer) {
        return;
      }

      this.auto = true;

      this.timer = setInterval(() => {
        this.fetchTail();
      }, 5000);
    },

    stopAuto() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }

      this.auto = false;
    },

    async copy() {
      if (!this.content) {
        this.notify("error", "Nothing to copy");
        return;
      }

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(this.content);
        } else {
          const textarea = document.createElement("textarea");

          textarea.value = this.content;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "fixed";
          textarea.style.top = "-9999px";

          document.body.appendChild(textarea);
          textarea.select();

          const copied = document.execCommand("copy");
          textarea.remove();

          if (!copied) {
            throw new Error("Clipboard operation failed");
          }
        }

        this.notify("success", "Log copied");
      } catch (error) {
        this.notify(
          "error",
          error?.message || "Copy failed"
        );
      }
    }
  }
};
</script>

<style scoped>
.k-logger-section {
  margin-bottom: 1rem;
}

.k-logger-box {
  min-width: 0;
}

.k-logger-content {
  width: 100%;
  min-width: 0;
  max-height: calc(100vh - 360px);
  overflow: auto;

  font-family: var(--font-mono);
  font-size: var(--text-md);
  line-height: 1.5;
  white-space: pre;
}
</style>
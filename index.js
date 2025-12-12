import { defineComponent as k, resolveComponent as i, createBlock as b, openBlock as r, withCtx as o, createVNode as n, createTextVNode as s, toDisplayString as f, createElementVNode as _, createElementBlock as d, Fragment as c } from "vue";
const V = (t, e) => {
  const l = t.__vccOpts || t;
  for (const [p, h] of e)
    l[p] = h;
  return l;
}, M = k({
  name: "Logger",
  props: {
    title: String,
    tailEndpoint: {
      type: String,
      required: !0
    },
    defaultLines: {
      type: Number,
      default: 400
    },
    filename: String
  },
  data() {
    return {
      content: "",
      lines: this.defaultLines,
      loading: !1,
      auto: !1,
      timer: null
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
    onLinesChange(t) {
      this.lines = Number(t);
    },
    notify(t, e) {
      const l = this.$panel && (this.$panel.notifications || this.$panel.notification);
      if (l && typeof l[t] == "function") {
        l[t](e);
        return;
      }
      console.warn("Notification:", t, e);
    },
    async fetchTail() {
      if (!this.tailEndpoint) {
        this.notify("error", "Missing tail endpoint");
        return;
      }
      try {
        this.loading = !0;
        const t = await this.$api.get(this.tailEndpoint, { lines: this.lines });
        this.content = t?.content ?? "";
      } catch (t) {
        this.notify("error", t?.message || "Failed to load log file");
      } finally {
        this.loading = !1;
      }
    },
    startAuto() {
      this.timer || (this.timer = setInterval(() => this.fetchTail(), 5e3));
    },
    stopAuto() {
      this.timer && (clearInterval(this.timer), this.timer = null);
    },
    toggleAuto() {
      this.auto = !this.auto, this.auto ? this.startAuto() : this.stopAuto();
    },
    async copy() {
      if (!this.content) {
        this.notify("error", "Nothing to copy");
        return;
      }
      try {
        if (navigator.clipboard?.writeText)
          await navigator.clipboard.writeText(this.content);
        else if (this.$panel && typeof this.$panel.copy == "function")
          await this.$panel.copy(this.content);
        else if (typeof this.$copy == "function")
          await this.$copy(this.content);
        else {
          const t = document.createElement("textarea");
          t.value = this.content, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.top = "-9999px", document.body.appendChild(t), t.select(), document.execCommand("copy"), document.body.removeChild(t);
        }
        this.notify("success", "Log copied");
      } catch (t) {
        this.notify("error", t?.message || "Copy failed");
      }
    }
  }
}), Z = { style: { "font-family": "var(--font-mono)", "font-size": "var(--text-md)", "line-height": "var(--height-md)", "max-height": "calc(100vh - 360px)", overflow: "auto", "white-space": "pre", width: "100%" } };
function H(t, e, l, p, h, x) {
  const a = i("k-button"), u = i("k-button-group"), g = i("k-header"), m = i("k-number-field"), v = i("k-section"), C = i("k-box"), y = i("k-view"), w = i("k-panel-inside");
  return r(), b(w, null, {
    default: o(() => [
      n(y, { class: "k-logger" }, {
        default: o(() => [
          n(g, { class: "k-site-view-header" }, {
            buttons: o(() => [
              n(u, null, {
                default: o(() => [
                  n(a, {
                    icon: "copy",
                    size: "xs",
                    variant: "filled",
                    theme: "blue-icon",
                    style: { "margin-left": ".5rem" },
                    onClick: t.copy,
                    disabled: t.loading || !t.content
                  }, {
                    default: o(() => [...e[0] || (e[0] = [
                      s(
                        " Copy ",
                        -1
                        /* CACHED */
                      )
                    ])]),
                    _: 1
                    /* STABLE */
                  }, 8, ["onClick", "disabled"]),
                  n(a, {
                    icon: "refresh",
                    size: "xs",
                    variant: "filled",
                    onClick: t.fetchTail,
                    disabled: t.loading,
                    responsive: "true"
                  }, {
                    default: o(() => [...e[1] || (e[1] = [
                      s(
                        " Refresh ",
                        -1
                        /* CACHED */
                      )
                    ])]),
                    _: 1
                    /* STABLE */
                  }, 8, ["onClick", "disabled"]),
                  n(a, {
                    icon: t.auto ? "refresh-stop" : "refresh-auto",
                    size: "xs",
                    variant: "filled",
                    theme: t.auto ? "red" : "green",
                    onClick: t.toggleAuto,
                    responsive: "true"
                  }, {
                    default: o(() => [
                      s(
                        f(t.auto ? "Stop" : "Auto-Refresh"),
                        1
                        /* TEXT */
                      )
                    ]),
                    _: 1
                    /* STABLE */
                  }, 8, ["icon", "theme", "onClick"])
                ]),
                _: 1
                /* STABLE */
              })
            ]),
            default: o(() => [
              e[2] || (e[2] = s(
                " Log Viewer ",
                -1
                /* CACHED */
              ))
            ]),
            _: 1
            /* STABLE */
          }),
          n(v, {
            label: "Log",
            style: { "margin-bottom": "1rem" }
          }, {
            options: o(() => [
              n(u, null, {
                default: o(() => [
                  n(m, {
                    "model-value": t.lines,
                    min: 10,
                    max: 2e3,
                    after: "Lines",
                    width: "1/3",
                    "onUpdate:modelValue": t.onLinesChange
                  }, null, 8, ["model-value", "onUpdate:modelValue"]),
                  n(a, {
                    icon: "check",
                    size: "lg",
                    variant: "filled",
                    onClick: t.fetchTail,
                    disabled: t.loading
                  }, {
                    default: o(() => [...e[3] || (e[3] = [
                      s(
                        " Apply ",
                        -1
                        /* CACHED */
                      )
                    ])]),
                    _: 1
                    /* STABLE */
                  }, 8, ["onClick", "disabled"])
                ]),
                _: 1
                /* STABLE */
              })
            ]),
            _: 1
            /* STABLE */
          }),
          n(C, { theme: "passive" }, {
            default: o(() => [
              _("div", Z, [
                t.loading ? (r(), d(
                  c,
                  { key: 0 },
                  [
                    s("Loading...")
                  ],
                  64
                  /* STABLE_FRAGMENT */
                )) : t.content ? (r(), d(
                  c,
                  { key: 1 },
                  [
                    s(
                      f(t.content),
                      1
                      /* TEXT */
                    )
                  ],
                  64
                  /* STABLE_FRAGMENT */
                )) : (r(), d(
                  c,
                  { key: 2 },
                  [
                    s("No log content")
                  ],
                  64
                  /* STABLE_FRAGMENT */
                ))
              ])
            ]),
            _: 1
            /* STABLE */
          })
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
const L = /* @__PURE__ */ V(M, [["render", H]]), $ = {
  logger: '<svg id="a" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21,23H3c-1.1,0-2-.9-2-2V3c0-1.1.9-2,2-2h18c1.1,0,2,.9,2,2v18c0,1.1-.9,2-2,2ZM17.53,17.45c-1.53.91-3.54.7-4.86-.62-1.56-1.56-1.56-4.09,0-5.66,1.56-1.56,4.09-1.56,5.66,0,1.32,1.32,1.52,3.33.62,4.86l2.21,2.21-1.41,1.41-2.21-2.21ZM16.91,15.41c.78-.78.78-2.05,0-2.83-.78-.78-2.05-.78-2.83,0-.78.78-.78,2.05,0,2.83.78.78,2.05.78,2.83,0ZM19,5H5v2h14v-2ZM10,11h-5v2h5v-2ZM10,17h-5v2h5v-2Z" style="fill-rule:evenodd;"/></svg>',
  log: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 22H5C3.34315 22 2 20.6569 2 19V3C2 2.44772 2.44772 2 3 2H17C17.5523 2 18 2.44772 18 3V15H22V19C22 20.6569 20.6569 22 19 22ZM18 17V19C18 19.5523 18.4477 20 19 20C19.5523 20 20 19.5523 20 19V17H18ZM16 20V4H4V19C4 19.5523 4.44772 20 5 20H16ZM6 7H14V9H6V7ZM6 11H14V13H6V11ZM6 15H11V17H6V15Z"></path></svg>',
  "refresh-auto": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM10.6219 8.41459L15.5008 11.6672C15.6846 11.7897 15.7343 12.0381 15.6117 12.2219C15.5824 12.2658 15.5447 12.3035 15.5008 12.3328L10.6219 15.5854C10.4381 15.708 10.1897 15.6583 10.0672 15.4745C10.0234 15.4088 10 15.3316 10 15.2526V8.74741C10 8.52649 10.1791 8.34741 10.4 8.34741C10.479 8.34741 10.5562 8.37078 10.6219 8.41459Z"></path></svg>',
  "refresh-stop": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM9 9H15V15H9V9Z"></path></svg>'
};
panel.plugin("scottboms/logger", {
  icons: $,
  components: {
    "k-logger-view": L
  }
});

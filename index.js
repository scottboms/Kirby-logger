import { resolveComponent as s, createBlock as b, openBlock as h, withCtx as n, createVNode as i, createTextVNode as l, toDisplayString as u, createElementVNode as x, createElementBlock as p, Fragment as f } from "vue";
const V = (t, e) => {
  const r = t.__vccOpts || t;
  for (const [d, o] of e)
    r[d] = o;
  return r;
}, M = {
  name: "Logger",
  props: {
    title: String,
    tailEndpoint: String,
    // e.g. /logger/tail (api route)
    defaultLines: Number,
    filename: String
  },
  data() {
    return {
      content: "",
      lines: this.defaultLines || 400,
      loading: !1,
      auto: !1,
      timer: null
    };
  },
  created() {
    this.fetchTail();
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer);
  },
  methods: {
    notify(t, e) {
      const r = this.$panel && (this.$panel.notifications || this.$panel.notification);
      if (r && typeof r[t] == "function") {
        r[t](e);
        return;
      }
      console.warn("Notification:", t, e);
    },
    async fetchTail() {
      try {
        this.loading = !0;
        const t = await this.$api.get(this.tailEndpoint, { lines: this.lines });
        this.content = t && t.content ? t.content : "";
      } catch (t) {
        this.notify("error", t.message || "Failed to load log file");
      } finally {
        this.loading = !1;
      }
    },
    toggleAuto() {
      this.auto = !this.auto, this.auto ? this.timer = setInterval(this.fetchTail, 5e3) : this.timer && (clearInterval(this.timer), this.timer = null);
    },
    async copy() {
      if (!this.content) {
        this.notify("error", "Nothing to copy");
        return;
      }
      try {
        if (navigator.clipboard && navigator.clipboard.writeText)
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
}, Z = { style: { "font-family": "var(--font-mono)", "font-size": "var(--text-md)", "line-height": "var(--height-md)", "max-height": "calc(100vh - 360px)", overflow: "auto", "white-space": "pre", width: "100%" } };
function H(t, e, r, d, o, a) {
  const c = s("k-button"), g = s("k-button-group"), m = s("k-header"), v = s("k-number-field"), C = s("k-section"), y = s("k-box"), _ = s("k-view"), w = s("k-panel-inside");
  return h(), b(w, null, {
    default: n(() => [
      i(_, { class: "k-logger" }, {
        default: n(() => [
          i(m, { class: "k-site-view-header" }, {
            default: n(() => [
              e[3] || (e[3] = l(
                " Log Viewer ",
                -1
                /* CACHED */
              )),
              i(g, { slot: "buttons" }, {
                default: n(() => [
                  i(c, {
                    icon: "copy",
                    size: "xs",
                    variant: "filled",
                    theme: "blue-icon",
                    style: { "margin-left": ".5rem" },
                    onClick: a.copy,
                    disabled: o.loading || !o.content
                  }, {
                    default: n(() => [...e[1] || (e[1] = [
                      l(
                        "Copy",
                        -1
                        /* CACHED */
                      )
                    ])]),
                    _: 1
                    /* STABLE */
                  }, 8, ["onClick", "disabled"]),
                  i(c, {
                    icon: "refresh",
                    size: "xs",
                    variant: "filled",
                    onClick: a.fetchTail,
                    disabled: o.loading,
                    responsive: "true"
                  }, {
                    default: n(() => [...e[2] || (e[2] = [
                      l(
                        "Refresh",
                        -1
                        /* CACHED */
                      )
                    ])]),
                    _: 1
                    /* STABLE */
                  }, 8, ["onClick", "disabled"]),
                  i(c, {
                    icon: o.auto ? "refresh-stop" : "refresh-auto",
                    size: "xs",
                    variant: "filled",
                    theme: o.auto ? "red" : "green",
                    onClick: a.toggleAuto,
                    responsive: "true"
                  }, {
                    default: n(() => [
                      l(
                        u(o.auto ? "Stop" : "Auto-Refresh"),
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
            _: 1
            /* STABLE */
          }),
          i(C, {
            label: "Log",
            style: { "margin-bottom": "1rem" }
          }, {
            default: n(() => [
              i(g, { slot: "options" }, {
                default: n(() => [
                  i(v, {
                    value: o.lines,
                    min: 10,
                    max: 2e3,
                    after: "Lines",
                    width: "1/3",
                    onInput: e[0] || (e[0] = (k) => o.lines = Number(k))
                  }, null, 8, ["value"]),
                  i(c, {
                    icon: "check",
                    size: "lg",
                    variant: "filled",
                    onClick: a.fetchTail,
                    disabled: o.loading
                  }, {
                    default: n(() => [...e[4] || (e[4] = [
                      l(
                        "Apply",
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
          i(y, { theme: "passive" }, {
            default: n(() => [
              x("div", Z, [
                o.loading ? (h(), p(
                  f,
                  { key: 0 },
                  [
                    l("Loading...")
                  ],
                  64
                  /* STABLE_FRAGMENT */
                )) : o.content ? (h(), p(
                  f,
                  { key: 1 },
                  [
                    l(
                      u(o.content),
                      1
                      /* TEXT */
                    )
                  ],
                  64
                  /* STABLE_FRAGMENT */
                )) : (h(), p(
                  f,
                  { key: 2 },
                  [
                    l("No log content")
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
const L = /* @__PURE__ */ V(M, [["render", H]]), N = {
  logger: '<svg id="a" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21,23H3c-1.1,0-2-.9-2-2V3c0-1.1.9-2,2-2h18c1.1,0,2,.9,2,2v18c0,1.1-.9,2-2,2ZM17.53,17.45c-1.53.91-3.54.7-4.86-.62-1.56-1.56-1.56-4.09,0-5.66,1.56-1.56,4.09-1.56,5.66,0,1.32,1.32,1.52,3.33.62,4.86l2.21,2.21-1.41,1.41-2.21-2.21ZM16.91,15.41c.78-.78.78-2.05,0-2.83-.78-.78-2.05-.78-2.83,0-.78.78-.78,2.05,0,2.83.78.78,2.05.78,2.83,0ZM19,5H5v2h14v-2ZM10,11h-5v2h5v-2ZM10,17h-5v2h5v-2Z" style="fill-rule:evenodd;"/></svg>',
  log: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 22H5C3.34315 22 2 20.6569 2 19V3C2 2.44772 2.44772 2 3 2H17C17.5523 2 18 2.44772 18 3V15H22V19C22 20.6569 20.6569 22 19 22ZM18 17V19C18 19.5523 18.4477 20 19 20C19.5523 20 20 19.5523 20 19V17H18ZM16 20V4H4V19C4 19.5523 4.44772 20 5 20H16ZM6 7H14V9H6V7ZM6 11H14V13H6V11ZM6 15H11V17H6V15Z"></path></svg>',
  "refresh-auto": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM10.6219 8.41459L15.5008 11.6672C15.6846 11.7897 15.7343 12.0381 15.6117 12.2219C15.5824 12.2658 15.5447 12.3035 15.5008 12.3328L10.6219 15.5854C10.4381 15.708 10.1897 15.6583 10.0672 15.4745C10.0234 15.4088 10 15.3316 10 15.2526V8.74741C10 8.52649 10.1791 8.34741 10.4 8.34741C10.479 8.34741 10.5562 8.37078 10.6219 8.41459Z"></path></svg>',
  "refresh-stop": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM9 9H15V15H9V9Z"></path></svg>'
};
panel.plugin("scottboms/logger", {
  icons: N,
  components: {
    "k-logger-view": L
  }
});

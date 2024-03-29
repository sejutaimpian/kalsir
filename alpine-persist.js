(() => {
  function d(t) {
    let i = () => {
      let a, n;
      try {
        n = localStorage;
      } catch (r) {
        console.error(r),
          console.warn(
            "Alpine: $persist is using temporary storage since localStorage is unavailable."
          );
        let e = new Map();
        n = { getItem: e.get.bind(e), setItem: e.set.bind(e) };
      }
      return t.interceptor(
        (r, e, s, l, f) => {
          let o = a || `_x_${l}`,
            u = g(o, n) ? p(o, n) : r;
          return (
            s(u),
            t.effect(() => {
              let c = e();
              m(o, c, n), s(c);
            }),
            u
          );
        },
        (r) => {
          (r.as = (e) => ((a = e), r)), (r.using = (e) => ((n = e), r));
        }
      );
    };
    Object.defineProperty(t, "$persist", { get: () => i() }),
      t.magic("persist", i),
      (t.persist = (a, { get: n, set: r }, e = localStorage) => {
        let s = g(a, e) ? p(a, e) : n();
        r(s),
          t.effect(() => {
            let l = n();
            m(a, l, e), r(l);
          });
      });
  }
  function g(t, i) {
    return i.getItem(t) !== null;
  }
  function p(t, i) {
    return JSON.parse(i.getItem(t, i));
  }
  function m(t, i, a) {
    a.setItem(t, JSON.stringify(i));
  }
  document.addEventListener("alpine:init", () => {
    window.Alpine.plugin(d);
  });
})();

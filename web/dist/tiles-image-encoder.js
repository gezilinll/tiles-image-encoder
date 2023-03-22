class kn {
  constructor() {
    this.width = 0, this.height = 0;
  }
}
class En extends kn {
  constructor() {
    super(...arguments), this.quality = 100, this.downSample = !1, this.isRGB = !0, this.comment = "";
  }
}
var xn = (() => {
  var w = typeof document < "u" && document.currentScript ? document.currentScript.src : void 0;
  return function(x) {
    x = x || {};
    var a = typeof x < "u" ? x : {}, I, C;
    a.ready = new Promise(function(e, r) {
      I = e, C = r;
    });
    var Q = Object.assign({}, a), wr = !0, U = "";
    function Pr(e) {
      return a.locateFile ? a.locateFile(e, U) : U + e;
    }
    var Fr;
    typeof document < "u" && document.currentScript && (U = document.currentScript.src), w && (U = w), U.indexOf("blob:") !== 0 ? U = U.substr(0, U.replace(/[?#].*/, "").lastIndexOf("/") + 1) : U = "", a.print || console.log.bind(console);
    var Y = a.printErr || console.warn.bind(console);
    Object.assign(a, Q), Q = null, a.arguments && a.arguments, a.thisProgram && a.thisProgram, a.quit && a.quit;
    var Tr = 4, He = 0, j = (e) => {
      He = e;
    }, Cr = () => He, K;
    a.wasmBinary && (K = a.wasmBinary), a.noExitRuntime, typeof WebAssembly != "object" && ee("no native wasm support detected");
    var ue, Ie = !1, je = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0;
    function $r(e, r, t) {
      for (var n = r + t, i = r; e[i] && !(i >= n); )
        ++i;
      if (i - r > 16 && e.buffer && je)
        return je.decode(e.subarray(r, i));
      for (var o = ""; r < i; ) {
        var s = e[r++];
        if (!(s & 128)) {
          o += String.fromCharCode(s);
          continue;
        }
        var u = e[r++] & 63;
        if ((s & 224) == 192) {
          o += String.fromCharCode((s & 31) << 6 | u);
          continue;
        }
        var c = e[r++] & 63;
        if ((s & 240) == 224 ? s = (s & 15) << 12 | u << 6 | c : s = (s & 7) << 18 | u << 12 | c << 6 | e[r++] & 63, s < 65536)
          o += String.fromCharCode(s);
        else {
          var f = s - 65536;
          o += String.fromCharCode(55296 | f >> 10, 56320 | f & 1023);
        }
      }
      return o;
    }
    function Ar(e, r) {
      return e ? $r(P, e, r) : "";
    }
    function kr(e, r, t, n) {
      if (!(n > 0))
        return 0;
      for (var i = t, o = t + n - 1, s = 0; s < e.length; ++s) {
        var u = e.charCodeAt(s);
        if (u >= 55296 && u <= 57343) {
          var c = e.charCodeAt(++s);
          u = 65536 + ((u & 1023) << 10) | c & 1023;
        }
        if (u <= 127) {
          if (t >= o)
            break;
          r[t++] = u;
        } else if (u <= 2047) {
          if (t + 1 >= o)
            break;
          r[t++] = 192 | u >> 6, r[t++] = 128 | u & 63;
        } else if (u <= 65535) {
          if (t + 2 >= o)
            break;
          r[t++] = 224 | u >> 12, r[t++] = 128 | u >> 6 & 63, r[t++] = 128 | u & 63;
        } else {
          if (t + 3 >= o)
            break;
          r[t++] = 240 | u >> 18, r[t++] = 128 | u >> 12 & 63, r[t++] = 128 | u >> 6 & 63, r[t++] = 128 | u & 63;
        }
      }
      return r[t] = 0, t - i;
    }
    function xr(e, r, t) {
      return kr(e, P, r, t);
    }
    function Rr(e) {
      for (var r = 0, t = 0; t < e.length; ++t) {
        var n = e.charCodeAt(t);
        n >= 55296 && n <= 57343 && (n = 65536 + ((n & 1023) << 10) | e.charCodeAt(++t) & 1023), n <= 127 ? ++r : n <= 2047 ? r += 2 : n <= 65535 ? r += 3 : r += 4;
      }
      return r;
    }
    var Ve = typeof TextDecoder < "u" ? new TextDecoder("utf-16le") : void 0;
    function Er(e, r) {
      for (var t = e, n = t >> 1, i = n + r / 2; !(n >= i) && ce[n]; )
        ++n;
      if (t = n << 1, t - e > 32 && Ve)
        return Ve.decode(P.subarray(e, t));
      for (var o = "", s = 0; !(s >= r / 2); ++s) {
        var u = G[e + s * 2 >> 1];
        if (u == 0)
          break;
        o += String.fromCharCode(u);
      }
      return o;
    }
    function Sr(e, r, t) {
      if (t === void 0 && (t = 2147483647), t < 2)
        return 0;
      t -= 2;
      for (var n = r, i = t < e.length * 2 ? t / 2 : e.length, o = 0; o < i; ++o) {
        var s = e.charCodeAt(o);
        G[r >> 1] = s, r += 2;
      }
      return G[r >> 1] = 0, r - n;
    }
    function Dr(e) {
      return e.length * 2;
    }
    function Wr(e, r) {
      for (var t = 0, n = ""; !(t >= r / 4); ) {
        var i = $[e + t * 4 >> 2];
        if (i == 0)
          break;
        if (++t, i >= 65536) {
          var o = i - 65536;
          n += String.fromCharCode(55296 | o >> 10, 56320 | o & 1023);
        } else
          n += String.fromCharCode(i);
      }
      return n;
    }
    function Or(e, r, t) {
      if (t === void 0 && (t = 2147483647), t < 4)
        return 0;
      for (var n = r, i = n + t - 4, o = 0; o < e.length; ++o) {
        var s = e.charCodeAt(o);
        if (s >= 55296 && s <= 57343) {
          var u = e.charCodeAt(++o);
          s = 65536 + ((s & 1023) << 10) | u & 1023;
        }
        if ($[r >> 2] = s, r += 4, r + 4 > i)
          break;
      }
      return $[r >> 2] = 0, r - n;
    }
    function Ur(e) {
      for (var r = 0, t = 0; t < e.length; ++t) {
        var n = e.charCodeAt(t);
        n >= 55296 && n <= 57343 && ++t, r += 4;
      }
      return r;
    }
    var ye, M, P, G, ce, $, h, Me, Be;
    function Le(e) {
      ye = e, a.HEAP8 = M = new Int8Array(e), a.HEAP16 = G = new Int16Array(e), a.HEAP32 = $ = new Int32Array(e), a.HEAPU8 = P = new Uint8Array(e), a.HEAPU16 = ce = new Uint16Array(e), a.HEAPU32 = h = new Uint32Array(e), a.HEAPF32 = Me = new Float32Array(e), a.HEAPF64 = Be = new Float64Array(e);
    }
    a.INITIAL_MEMORY;
    var qe, Ge = [], Je = [], ze = [];
    function Hr() {
      if (a.preRun)
        for (typeof a.preRun == "function" && (a.preRun = [a.preRun]); a.preRun.length; )
          Vr(a.preRun.shift());
      be(Ge);
    }
    function Ir() {
      be(Je);
    }
    function jr() {
      if (a.postRun)
        for (typeof a.postRun == "function" && (a.postRun = [a.postRun]); a.postRun.length; )
          Br(a.postRun.shift());
      be(ze);
    }
    function Vr(e) {
      Ge.unshift(e);
    }
    function Mr(e) {
      Je.unshift(e);
    }
    function Br(e) {
      ze.unshift(e);
    }
    var B = 0, X = null;
    function Lr(e) {
      B++, a.monitorRunDependencies && a.monitorRunDependencies(B);
    }
    function qr(e) {
      if (B--, a.monitorRunDependencies && a.monitorRunDependencies(B), B == 0 && X) {
        var r = X;
        X = null, r();
      }
    }
    function ee(e) {
      a.onAbort && a.onAbort(e), e = "Aborted(" + e + ")", Y(e), Ie = !0, e += ". Build with -sASSERTIONS for more info.";
      var r = new WebAssembly.RuntimeError(e);
      throw C(r), r;
    }
    var Gr = "data:application/octet-stream;base64,";
    function Ze(e) {
      return e.startsWith(Gr);
    }
    var R;
    R = "tilesimageencoder.wasm", Ze(R) || (R = Pr(R));
    function Ne(e) {
      try {
        if (e == R && K)
          return new Uint8Array(K);
        if (!Fr)
          throw "both async and sync fetching of the wasm failed";
      } catch (r) {
        ee(r);
      }
    }
    function Jr() {
      return !K && wr && typeof fetch == "function" ? fetch(R, { credentials: "same-origin" }).then(function(e) {
        if (!e.ok)
          throw "failed to load wasm binary file at '" + R + "'";
        return e.arrayBuffer();
      }).catch(function() {
        return Ne(R);
      }) : Promise.resolve().then(function() {
        return Ne(R);
      });
    }
    function zr() {
      var e = {
        env: pr,
        wasi_snapshot_preview1: pr
      };
      function r(s, u) {
        var c = s.exports;
        a.asm = c, ue = a.asm.memory, Le(ue.buffer), qe = a.asm.__indirect_function_table, Mr(a.asm.__wasm_call_ctors), qr();
      }
      Lr();
      function t(s) {
        r(s.instance);
      }
      function n(s) {
        return Jr().then(function(u) {
          return WebAssembly.instantiate(u, e);
        }).then(function(u) {
          return u;
        }).then(s, function(u) {
          Y("failed to asynchronously prepare wasm: " + u), ee(u);
        });
      }
      function i() {
        return !K && typeof WebAssembly.instantiateStreaming == "function" && !Ze(R) && typeof fetch == "function" ? fetch(R, { credentials: "same-origin" }).then(function(s) {
          var u = WebAssembly.instantiateStreaming(s, e);
          return u.then(
            t,
            function(c) {
              return Y("wasm streaming compile failed: " + c), Y("falling back to ArrayBuffer instantiation"), n(t);
            }
          );
        }) : n(t);
      }
      if (a.instantiateWasm)
        try {
          var o = a.instantiateWasm(e, r);
          return o;
        } catch (s) {
          return Y("Module.instantiateWasm callback failed with error: " + s), !1;
        }
      return i().catch(C), {};
    }
    function be(e) {
      for (; e.length > 0; )
        e.shift()(a);
    }
    var fe = [];
    function b(e) {
      var r = fe[e];
      return r || (e >= fe.length && (fe.length = e + 1), fe[e] = r = qe.get(e)), r;
    }
    function Zr(e) {
      return ge(e + 24) + 24;
    }
    var le = [];
    function Nr(e) {
      e.add_ref();
    }
    function Qr(e) {
      var r = new re(e);
      return r.get_caught() || r.set_caught(!0), r.set_rethrown(!1), le.push(r), Nr(r), r.get_exception_ptr();
    }
    var L = 0;
    function re(e) {
      this.excPtr = e, this.ptr = e - 24, this.set_type = function(r) {
        h[this.ptr + 4 >> 2] = r;
      }, this.get_type = function() {
        return h[this.ptr + 4 >> 2];
      }, this.set_destructor = function(r) {
        h[this.ptr + 8 >> 2] = r;
      }, this.get_destructor = function() {
        return h[this.ptr + 8 >> 2];
      }, this.set_refcount = function(r) {
        $[this.ptr >> 2] = r;
      }, this.set_caught = function(r) {
        r = r ? 1 : 0, M[this.ptr + 12 >> 0] = r;
      }, this.get_caught = function() {
        return M[this.ptr + 12 >> 0] != 0;
      }, this.set_rethrown = function(r) {
        r = r ? 1 : 0, M[this.ptr + 13 >> 0] = r;
      }, this.get_rethrown = function() {
        return M[this.ptr + 13 >> 0] != 0;
      }, this.init = function(r, t) {
        this.set_adjusted_ptr(0), this.set_type(r), this.set_destructor(t), this.set_refcount(0), this.set_caught(!1), this.set_rethrown(!1);
      }, this.add_ref = function() {
        var r = $[this.ptr >> 2];
        $[this.ptr >> 2] = r + 1;
      }, this.release_ref = function() {
        var r = $[this.ptr >> 2];
        return $[this.ptr >> 2] = r - 1, r === 1;
      }, this.set_adjusted_ptr = function(r) {
        h[this.ptr + 16 >> 2] = r;
      }, this.get_adjusted_ptr = function() {
        return h[this.ptr + 16 >> 2];
      }, this.get_exception_ptr = function() {
        var r = gr(this.get_type());
        if (r)
          return h[this.excPtr >> 2];
        var t = this.get_adjusted_ptr();
        return t !== 0 ? t : this.excPtr;
      };
    }
    function Qe(e) {
      return W(new re(e).ptr);
    }
    function Yr(e) {
      if (e.release_ref() && !e.get_rethrown()) {
        var r = e.get_destructor();
        r && b(r)(e.excPtr), Qe(e.excPtr);
      }
    }
    function Kr() {
      F(0);
      var e = le.pop();
      Yr(e), L = 0;
    }
    function Xr(e) {
      throw L || (L = e), e;
    }
    function et() {
      var e = L;
      if (!e)
        return j(0), 0;
      var r = new re(e);
      r.set_adjusted_ptr(e);
      var t = r.get_type();
      if (!t)
        return j(0), e;
      for (var n = Array.prototype.slice.call(arguments), i = 0; i < n.length; i++) {
        var o = n[i];
        if (o === 0 || o === t)
          break;
        var s = r.ptr + 16;
        if (We(o, t, s))
          return j(o), e;
      }
      return j(t), e;
    }
    function rt() {
      var e = L;
      if (!e)
        return j(0), 0;
      var r = new re(e);
      r.set_adjusted_ptr(e);
      var t = r.get_type();
      if (!t)
        return j(0), e;
      for (var n = Array.prototype.slice.call(arguments), i = 0; i < n.length; i++) {
        var o = n[i];
        if (o === 0 || o === t)
          break;
        var s = r.ptr + 16;
        if (We(o, t, s))
          return j(o), e;
      }
      return j(t), e;
    }
    function tt() {
      var e = le.pop();
      e || ee("no exception to throw");
      var r = e.excPtr;
      throw e.get_rethrown() || (le.push(e), e.set_rethrown(!0), e.set_caught(!1)), L = r, r;
    }
    function nt(e, r, t) {
      var n = new re(e);
      throw n.init(r, t), L = e, e;
    }
    function it(e, r, t, n, i) {
    }
    function we(e) {
      switch (e) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw new TypeError("Unknown type size: " + e);
      }
    }
    function at() {
      for (var e = new Array(256), r = 0; r < 256; ++r)
        e[r] = String.fromCharCode(r);
      Ye = e;
    }
    var Ye = void 0;
    function m(e) {
      for (var r = "", t = e; P[t]; )
        r += Ye[P[t++]];
      return r;
    }
    var J = {}, q = {}, _e = {}, ot = 48, st = 57;
    function de(e) {
      if (e === void 0)
        return "_unknown";
      e = e.replace(/[^a-zA-Z0-9_]/g, "$");
      var r = e.charCodeAt(0);
      return r >= ot && r <= st ? "_" + e : e;
    }
    function Pe(e, r) {
      return e = de(e), new Function(
        "body",
        "return function " + e + `() {
    "use strict";    return body.apply(this, arguments);
};
`
      )(r);
    }
    function Fe(e, r) {
      var t = Pe(r, function(n) {
        this.name = r, this.message = n;
        var i = new Error(n).stack;
        i !== void 0 && (this.stack = this.toString() + `
` + i.replace(/^Error(:[^\n]*)?\n/, ""));
      });
      return t.prototype = Object.create(e.prototype), t.prototype.constructor = t, t.prototype.toString = function() {
        return this.message === void 0 ? this.name : this.name + ": " + this.message;
      }, t;
    }
    var te = void 0;
    function v(e) {
      throw new te(e);
    }
    var Ke = void 0;
    function ve(e) {
      throw new Ke(e);
    }
    function ne(e, r, t) {
      e.forEach(function(u) {
        _e[u] = r;
      });
      function n(u) {
        var c = t(u);
        c.length !== e.length && ve("Mismatched type converter count");
        for (var f = 0; f < e.length; ++f)
          H(e[f], c[f]);
      }
      var i = new Array(r.length), o = [], s = 0;
      r.forEach((u, c) => {
        q.hasOwnProperty(u) ? i[c] = q[u] : (o.push(u), J.hasOwnProperty(u) || (J[u] = []), J[u].push(() => {
          i[c] = q[u], ++s, s === o.length && n(i);
        }));
      }), o.length === 0 && n(i);
    }
    function H(e, r, t = {}) {
      if (!("argPackAdvance" in r))
        throw new TypeError("registerType registeredInstance requires argPackAdvance");
      var n = r.name;
      if (e || v('type "' + n + '" must have a positive integer typeid pointer'), q.hasOwnProperty(e)) {
        if (t.ignoreDuplicateRegistrations)
          return;
        v("Cannot register type '" + n + "' twice");
      }
      if (q[e] = r, delete _e[e], J.hasOwnProperty(e)) {
        var i = J[e];
        delete J[e], i.forEach((o) => o());
      }
    }
    function ut(e, r, t, n, i) {
      var o = we(t);
      r = m(r), H(e, {
        name: r,
        fromWireType: function(s) {
          return !!s;
        },
        toWireType: function(s, u) {
          return u ? n : i;
        },
        argPackAdvance: 8,
        readValueFromPointer: function(s) {
          var u;
          if (t === 1)
            u = M;
          else if (t === 2)
            u = G;
          else if (t === 4)
            u = $;
          else
            throw new TypeError("Unknown boolean type size: " + r);
          return this.fromWireType(u[s >> o]);
        },
        destructorFunction: null
        // This type does not need a destructor
      });
    }
    function ct(e) {
      if (!(this instanceof V) || !(e instanceof V))
        return !1;
      for (var r = this.$$.ptrType.registeredClass, t = this.$$.ptr, n = e.$$.ptrType.registeredClass, i = e.$$.ptr; r.baseClass; )
        t = r.upcast(t), r = r.baseClass;
      for (; n.baseClass; )
        i = n.upcast(i), n = n.baseClass;
      return r === n && t === i;
    }
    function ft(e) {
      return {
        count: e.count,
        deleteScheduled: e.deleteScheduled,
        preservePointerOnDelete: e.preservePointerOnDelete,
        ptr: e.ptr,
        ptrType: e.ptrType,
        smartPtr: e.smartPtr,
        smartPtrType: e.smartPtrType
      };
    }
    function Te(e) {
      function r(t) {
        return t.$$.ptrType.registeredClass.name;
      }
      v(r(e) + " instance already deleted");
    }
    var Ce = !1;
    function Xe(e) {
    }
    function lt(e) {
      e.smartPtr ? e.smartPtrType.rawDestructor(e.smartPtr) : e.ptrType.registeredClass.rawDestructor(e.ptr);
    }
    function er(e) {
      e.count.value -= 1;
      var r = e.count.value === 0;
      r && lt(e);
    }
    function rr(e, r, t) {
      if (r === t)
        return e;
      if (t.baseClass === void 0)
        return null;
      var n = rr(e, r, t.baseClass);
      return n === null ? null : t.downcast(n);
    }
    var tr = {};
    function _t() {
      return Object.keys(oe).length;
    }
    function dt() {
      var e = [];
      for (var r in oe)
        oe.hasOwnProperty(r) && e.push(oe[r]);
      return e;
    }
    var ie = [];
    function $e() {
      for (; ie.length; ) {
        var e = ie.pop();
        e.$$.deleteScheduled = !1, e.delete();
      }
    }
    var ae = void 0;
    function vt(e) {
      ae = e, ie.length && ae && ae($e);
    }
    function pt() {
      a.getInheritedInstanceCount = _t, a.getLiveInheritedInstances = dt, a.flushPendingDeletes = $e, a.setDelayFunction = vt;
    }
    var oe = {};
    function ht(e, r) {
      for (r === void 0 && v("ptr should not be undefined"); e.baseClass; )
        r = e.upcast(r), e = e.baseClass;
      return r;
    }
    function gt(e, r) {
      return r = ht(e, r), oe[r];
    }
    function pe(e, r) {
      (!r.ptrType || !r.ptr) && ve("makeClassHandle requires ptr and ptrType");
      var t = !!r.smartPtrType, n = !!r.smartPtr;
      return t !== n && ve("Both smartPtrType and smartPtr must be specified"), r.count = { value: 1 }, se(Object.create(e, {
        $$: {
          value: r
        }
      }));
    }
    function mt(e) {
      var r = this.getPointee(e);
      if (!r)
        return this.destructor(e), null;
      var t = gt(this.registeredClass, r);
      if (t !== void 0) {
        if (t.$$.count.value === 0)
          return t.$$.ptr = r, t.$$.smartPtr = e, t.clone();
        var n = t.clone();
        return this.destructor(e), n;
      }
      function i() {
        return this.isSmartPointer ? pe(this.registeredClass.instancePrototype, {
          ptrType: this.pointeeType,
          ptr: r,
          smartPtrType: this,
          smartPtr: e
        }) : pe(this.registeredClass.instancePrototype, {
          ptrType: this,
          ptr: e
        });
      }
      var o = this.registeredClass.getActualType(r), s = tr[o];
      if (!s)
        return i.call(this);
      var u;
      this.isConst ? u = s.constPointerType : u = s.pointerType;
      var c = rr(
        r,
        this.registeredClass,
        u.registeredClass
      );
      return c === null ? i.call(this) : this.isSmartPointer ? pe(u.registeredClass.instancePrototype, {
        ptrType: u,
        ptr: c,
        smartPtrType: this,
        smartPtr: e
      }) : pe(u.registeredClass.instancePrototype, {
        ptrType: u,
        ptr: c
      });
    }
    function se(e) {
      return typeof FinalizationRegistry > "u" ? (se = (r) => r, e) : (Ce = new FinalizationRegistry((r) => {
        er(r.$$);
      }), se = (r) => {
        var t = r.$$, n = !!t.smartPtr;
        if (n) {
          var i = { $$: t };
          Ce.register(r, i, r);
        }
        return r;
      }, Xe = (r) => Ce.unregister(r), se(e));
    }
    function yt() {
      if (this.$$.ptr || Te(this), this.$$.preservePointerOnDelete)
        return this.$$.count.value += 1, this;
      var e = se(Object.create(Object.getPrototypeOf(this), {
        $$: {
          value: ft(this.$$)
        }
      }));
      return e.$$.count.value += 1, e.$$.deleteScheduled = !1, e;
    }
    function bt() {
      this.$$.ptr || Te(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && v("Object already scheduled for deletion"), Xe(this), er(this.$$), this.$$.preservePointerOnDelete || (this.$$.smartPtr = void 0, this.$$.ptr = void 0);
    }
    function wt() {
      return !this.$$.ptr;
    }
    function Pt() {
      return this.$$.ptr || Te(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && v("Object already scheduled for deletion"), ie.push(this), ie.length === 1 && ae && ae($e), this.$$.deleteScheduled = !0, this;
    }
    function Ft() {
      V.prototype.isAliasOf = ct, V.prototype.clone = yt, V.prototype.delete = bt, V.prototype.isDeleted = wt, V.prototype.deleteLater = Pt;
    }
    function V() {
    }
    function nr(e, r, t) {
      if (e[r].overloadTable === void 0) {
        var n = e[r];
        e[r] = function() {
          return e[r].overloadTable.hasOwnProperty(arguments.length) || v("Function '" + t + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + e[r].overloadTable + ")!"), e[r].overloadTable[arguments.length].apply(this, arguments);
        }, e[r].overloadTable = [], e[r].overloadTable[n.argCount] = n;
      }
    }
    function ir(e, r, t) {
      a.hasOwnProperty(e) ? ((t === void 0 || a[e].overloadTable !== void 0 && a[e].overloadTable[t] !== void 0) && v("Cannot register public name '" + e + "' twice"), nr(a, e, e), a.hasOwnProperty(t) && v("Cannot register multiple overloads of a function with the same number of arguments (" + t + ")!"), a[e].overloadTable[t] = r) : (a[e] = r, t !== void 0 && (a[e].numArguments = t));
    }
    function Tt(e, r, t, n, i, o, s, u) {
      this.name = e, this.constructor = r, this.instancePrototype = t, this.rawDestructor = n, this.baseClass = i, this.getActualType = o, this.upcast = s, this.downcast = u, this.pureVirtualFunctions = [];
    }
    function Ae(e, r, t) {
      for (; r !== t; )
        r.upcast || v("Expected null or instance of " + t.name + ", got an instance of " + r.name), e = r.upcast(e), r = r.baseClass;
      return e;
    }
    function Ct(e, r) {
      if (r === null)
        return this.isReference && v("null is not a valid " + this.name), 0;
      r.$$ || v('Cannot pass "' + Ee(r) + '" as a ' + this.name), r.$$.ptr || v("Cannot pass deleted object as a pointer of type " + this.name);
      var t = r.$$.ptrType.registeredClass, n = Ae(r.$$.ptr, t, this.registeredClass);
      return n;
    }
    function $t(e, r) {
      var t;
      if (r === null)
        return this.isReference && v("null is not a valid " + this.name), this.isSmartPointer ? (t = this.rawConstructor(), e !== null && e.push(this.rawDestructor, t), t) : 0;
      r.$$ || v('Cannot pass "' + Ee(r) + '" as a ' + this.name), r.$$.ptr || v("Cannot pass deleted object as a pointer of type " + this.name), !this.isConst && r.$$.ptrType.isConst && v("Cannot convert argument of type " + (r.$$.smartPtrType ? r.$$.smartPtrType.name : r.$$.ptrType.name) + " to parameter type " + this.name);
      var n = r.$$.ptrType.registeredClass;
      if (t = Ae(r.$$.ptr, n, this.registeredClass), this.isSmartPointer)
        switch (r.$$.smartPtr === void 0 && v("Passing raw pointer to smart pointer is illegal"), this.sharingPolicy) {
          case 0:
            r.$$.smartPtrType === this ? t = r.$$.smartPtr : v("Cannot convert argument of type " + (r.$$.smartPtrType ? r.$$.smartPtrType.name : r.$$.ptrType.name) + " to parameter type " + this.name);
            break;
          case 1:
            t = r.$$.smartPtr;
            break;
          case 2:
            if (r.$$.smartPtrType === this)
              t = r.$$.smartPtr;
            else {
              var i = r.clone();
              t = this.rawShare(
                t,
                y.toHandle(function() {
                  i.delete();
                })
              ), e !== null && e.push(this.rawDestructor, t);
            }
            break;
          default:
            v("Unsupporting sharing policy");
        }
      return t;
    }
    function At(e, r) {
      if (r === null)
        return this.isReference && v("null is not a valid " + this.name), 0;
      r.$$ || v('Cannot pass "' + Ee(r) + '" as a ' + this.name), r.$$.ptr || v("Cannot pass deleted object as a pointer of type " + this.name), r.$$.ptrType.isConst && v("Cannot convert argument of type " + r.$$.ptrType.name + " to parameter type " + this.name);
      var t = r.$$.ptrType.registeredClass, n = Ae(r.$$.ptr, t, this.registeredClass);
      return n;
    }
    function he(e) {
      return this.fromWireType($[e >> 2]);
    }
    function kt(e) {
      return this.rawGetPointee && (e = this.rawGetPointee(e)), e;
    }
    function xt(e) {
      this.rawDestructor && this.rawDestructor(e);
    }
    function Rt(e) {
      e !== null && e.delete();
    }
    function Et() {
      S.prototype.getPointee = kt, S.prototype.destructor = xt, S.prototype.argPackAdvance = 8, S.prototype.readValueFromPointer = he, S.prototype.deleteObject = Rt, S.prototype.fromWireType = mt;
    }
    function S(e, r, t, n, i, o, s, u, c, f, d) {
      this.name = e, this.registeredClass = r, this.isReference = t, this.isConst = n, this.isSmartPointer = i, this.pointeeType = o, this.sharingPolicy = s, this.rawGetPointee = u, this.rawConstructor = c, this.rawShare = f, this.rawDestructor = d, !i && r.baseClass === void 0 ? n ? (this.toWireType = Ct, this.destructorFunction = null) : (this.toWireType = At, this.destructorFunction = null) : this.toWireType = $t;
    }
    function ar(e, r, t) {
      a.hasOwnProperty(e) || ve("Replacing nonexistant public symbol"), a[e].overloadTable !== void 0 && t !== void 0 ? a[e].overloadTable[t] = r : (a[e] = r, a[e].argCount = t);
    }
    function St(e, r, t) {
      var n = a["dynCall_" + e];
      return t && t.length ? n.apply(null, [r].concat(t)) : n.call(null, r);
    }
    function Dt(e, r, t) {
      if (e.includes("j"))
        return St(e, r, t);
      var n = b(r).apply(null, t);
      return n;
    }
    function Wt(e, r) {
      var t = [];
      return function() {
        return t.length = 0, Object.assign(t, arguments), Dt(e, r, t);
      };
    }
    function D(e, r) {
      e = m(e);
      function t() {
        return e.includes("j") ? Wt(e, r) : b(r);
      }
      var n = t();
      return typeof n != "function" && v("unknown function pointer with signature " + e + ": " + r), n;
    }
    var or = void 0;
    function sr(e) {
      var r = hr(e), t = m(r);
      return W(r), t;
    }
    function ke(e, r) {
      var t = [], n = {};
      function i(o) {
        if (!n[o] && !q[o]) {
          if (_e[o]) {
            _e[o].forEach(i);
            return;
          }
          t.push(o), n[o] = !0;
        }
      }
      throw r.forEach(i), new or(e + ": " + t.map(sr).join([", "]));
    }
    function Ot(e, r, t, n, i, o, s, u, c, f, d, l, _) {
      d = m(d), o = D(i, o), u && (u = D(s, u)), f && (f = D(c, f)), _ = D(l, _);
      var p = de(d);
      ir(p, function() {
        ke("Cannot construct " + d + " due to unbound types", [n]);
      }), ne(
        [e, r, t],
        n ? [n] : [],
        function(g) {
          g = g[0];
          var T, O;
          n ? (T = g.registeredClass, O = T.instancePrototype) : O = V.prototype;
          var z = Pe(p, function() {
            if (Object.getPrototypeOf(this) !== Ue)
              throw new te("Use 'new' to construct " + d);
            if (Z.constructor_body === void 0)
              throw new te(d + " has no accessible constructor");
            var br = Z.constructor_body[arguments.length];
            if (br === void 0)
              throw new te("Tried to invoke ctor of " + d + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(Z.constructor_body).toString() + ") parameters instead!");
            return br.apply(this, arguments);
          }), Ue = Object.create(O, {
            constructor: { value: z }
          });
          z.prototype = Ue;
          var Z = new Tt(
            d,
            z,
            Ue,
            _,
            T,
            o,
            u,
            f
          ), An = new S(
            d,
            Z,
            !0,
            !1,
            !1
          ), mr = new S(
            d + "*",
            Z,
            !1,
            !1,
            !1
          ), yr = new S(
            d + " const*",
            Z,
            !1,
            !0,
            !1
          );
          return tr[e] = {
            pointerType: mr,
            constPointerType: yr
          }, ar(p, z), [An, mr, yr];
        }
      );
    }
    function ur(e, r) {
      if (!(e instanceof Function))
        throw new TypeError("new_ called with constructor type " + typeof e + " which is not a function");
      var t = Pe(e.name || "unknownFunctionName", function() {
      });
      t.prototype = e.prototype;
      var n = new t(), i = e.apply(n, r);
      return i instanceof Object ? i : n;
    }
    function cr(e) {
      for (; e.length; ) {
        var r = e.pop(), t = e.pop();
        t(r);
      }
    }
    function fr(e, r, t, n, i) {
      var o = r.length;
      o < 2 && v("argTypes array size mismatch! Must at least get return value and 'this' types!");
      for (var s = r[1] !== null && t !== null, u = !1, c = 1; c < r.length; ++c)
        if (r[c] !== null && r[c].destructorFunction === void 0) {
          u = !0;
          break;
        }
      for (var f = r[0].name !== "void", d = "", l = "", c = 0; c < o - 2; ++c)
        d += (c !== 0 ? ", " : "") + "arg" + c, l += (c !== 0 ? ", " : "") + "arg" + c + "Wired";
      var _ = "return function " + de(e) + "(" + d + `) {
if (arguments.length !== ` + (o - 2) + `) {
throwBindingError('function ` + e + " called with ' + arguments.length + ' arguments, expected " + (o - 2) + ` args!');
}
`;
      u && (_ += `var destructors = [];
`);
      var p = u ? "destructors" : "null", g = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"], T = [v, n, i, cr, r[0], r[1]];
      s && (_ += "var thisWired = classParam.toWireType(" + p + `, this);
`);
      for (var c = 0; c < o - 2; ++c)
        _ += "var arg" + c + "Wired = argType" + c + ".toWireType(" + p + ", arg" + c + "); // " + r[c + 2].name + `
`, g.push("argType" + c), T.push(r[c + 2]);
      if (s && (l = "thisWired" + (l.length > 0 ? ", " : "") + l), _ += (f ? "var rv = " : "") + "invoker(fn" + (l.length > 0 ? ", " : "") + l + `);
`, u)
        _ += `runDestructors(destructors);
`;
      else
        for (var c = s ? 1 : 2; c < r.length; ++c) {
          var O = c === 1 ? "thisWired" : "arg" + (c - 2) + "Wired";
          r[c].destructorFunction !== null && (_ += O + "_dtor(" + O + "); // " + r[c].name + `
`, g.push(O + "_dtor"), T.push(r[c].destructorFunction));
        }
      f && (_ += `var ret = retType.fromWireType(rv);
return ret;
`), _ += `}
`, g.push(_);
      var z = ur(Function, g).apply(null, T);
      return z;
    }
    function lr(e, r) {
      for (var t = [], n = 0; n < e; n++)
        t.push(h[r + n * 4 >> 2]);
      return t;
    }
    function Ut(e, r, t, n, i, o, s, u) {
      var c = lr(t, n);
      r = m(r), o = D(i, o), ne([], [e], function(f) {
        f = f[0];
        var d = f.name + "." + r;
        r.startsWith("@@") && (r = Symbol[r.substring(2)]), u && f.registeredClass.pureVirtualFunctions.push(r);
        function l() {
          ke("Cannot call " + d + " due to unbound types", c);
        }
        var _ = f.registeredClass.instancePrototype, p = _[r];
        return p === void 0 || p.overloadTable === void 0 && p.className !== f.name && p.argCount === t - 2 ? (l.argCount = t - 2, l.className = f.name, _[r] = l) : (nr(_, r, d), _[r].overloadTable[t - 2] = l), ne([], c, function(g) {
          var T = fr(d, g, f, o, s);
          return _[r].overloadTable === void 0 ? (T.argCount = t - 2, _[r] = T) : _[r].overloadTable[t - 2] = T, [];
        }), [];
      });
    }
    var xe = [], E = [{}, { value: void 0 }, { value: null }, { value: !0 }, { value: !1 }];
    function Re(e) {
      e > 4 && --E[e].refcount === 0 && (E[e] = void 0, xe.push(e));
    }
    function Ht() {
      for (var e = 0, r = 5; r < E.length; ++r)
        E[r] !== void 0 && ++e;
      return e;
    }
    function It() {
      for (var e = 5; e < E.length; ++e)
        if (E[e] !== void 0)
          return E[e];
      return null;
    }
    function jt() {
      a.count_emval_handles = Ht, a.get_first_emval = It;
    }
    var y = { toValue: (e) => (e || v("Cannot use deleted val. handle = " + e), E[e].value), toHandle: (e) => {
      switch (e) {
        case void 0:
          return 1;
        case null:
          return 2;
        case !0:
          return 3;
        case !1:
          return 4;
        default: {
          var r = xe.length ? xe.pop() : E.length;
          return E[r] = { refcount: 1, value: e }, r;
        }
      }
    } };
    function Vt(e, r) {
      r = m(r), H(e, {
        name: r,
        fromWireType: function(t) {
          var n = y.toValue(t);
          return Re(t), n;
        },
        toWireType: function(t, n) {
          return y.toHandle(n);
        },
        argPackAdvance: 8,
        readValueFromPointer: he,
        destructorFunction: null
        // This type does not need a destructor
        // TODO: do we need a deleteObject here?  write a test where
        // emval is passed into JS via an interface
      });
    }
    function Ee(e) {
      if (e === null)
        return "null";
      var r = typeof e;
      return r === "object" || r === "array" || r === "function" ? e.toString() : "" + e;
    }
    function Mt(e, r) {
      switch (r) {
        case 2:
          return function(t) {
            return this.fromWireType(Me[t >> 2]);
          };
        case 3:
          return function(t) {
            return this.fromWireType(Be[t >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + e);
      }
    }
    function Bt(e, r, t) {
      var n = we(t);
      r = m(r), H(e, {
        name: r,
        fromWireType: function(i) {
          return i;
        },
        toWireType: function(i, o) {
          return o;
        },
        argPackAdvance: 8,
        readValueFromPointer: Mt(r, n),
        destructorFunction: null
        // This type does not need a destructor
      });
    }
    function Lt(e, r, t, n, i, o) {
      var s = lr(r, t);
      e = m(e), i = D(n, i), ir(e, function() {
        ke("Cannot call " + e + " due to unbound types", s);
      }, r - 1), ne([], s, function(u) {
        var c = [
          u[0],
          null
          /* no class 'this'*/
        ].concat(
          u.slice(1)
          /* actual params */
        );
        return ar(e, fr(e, c, null, i, o), r - 1), [];
      });
    }
    function qt(e, r, t) {
      switch (r) {
        case 0:
          return t ? function(i) {
            return M[i];
          } : function(i) {
            return P[i];
          };
        case 1:
          return t ? function(i) {
            return G[i >> 1];
          } : function(i) {
            return ce[i >> 1];
          };
        case 2:
          return t ? function(i) {
            return $[i >> 2];
          } : function(i) {
            return h[i >> 2];
          };
        default:
          throw new TypeError("Unknown integer type: " + e);
      }
    }
    function Gt(e, r, t, n, i) {
      r = m(r);
      var o = we(t), s = (l) => l;
      if (n === 0) {
        var u = 32 - 8 * t;
        s = (l) => l << u >>> u;
      }
      var c = r.includes("unsigned"), f = (l, _) => {
      }, d;
      c ? d = function(l, _) {
        return f(_, this.name), _ >>> 0;
      } : d = function(l, _) {
        return f(_, this.name), _;
      }, H(e, {
        name: r,
        fromWireType: s,
        toWireType: d,
        argPackAdvance: 8,
        readValueFromPointer: qt(r, o, n !== 0),
        destructorFunction: null
        // This type does not need a destructor
      });
    }
    function Jt(e, r, t) {
      var n = [
        Int8Array,
        Uint8Array,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float32Array,
        Float64Array
      ], i = n[r];
      function o(s) {
        s = s >> 2;
        var u = h, c = u[s], f = u[s + 1];
        return new i(ye, f, c);
      }
      t = m(t), H(e, {
        name: t,
        fromWireType: o,
        argPackAdvance: 8,
        readValueFromPointer: o
      }, {
        ignoreDuplicateRegistrations: !0
      });
    }
    function zt(e, r, t, n, i, o, s, u, c, f, d, l) {
      t = m(t), o = D(i, o), u = D(s, u), f = D(c, f), l = D(d, l), ne([e], [r], function(_) {
        _ = _[0];
        var p = new S(
          t,
          _.registeredClass,
          !1,
          !1,
          // smart pointer properties
          !0,
          _,
          n,
          o,
          u,
          f,
          l
        );
        return [p];
      });
    }
    function Zt(e, r) {
      r = m(r);
      var t = r === "std::string";
      H(e, {
        name: r,
        fromWireType: function(n) {
          var i = h[n >> 2], o = n + 4, s;
          if (t)
            for (var u = o, c = 0; c <= i; ++c) {
              var f = o + c;
              if (c == i || P[f] == 0) {
                var d = f - u, l = Ar(u, d);
                s === void 0 ? s = l : (s += String.fromCharCode(0), s += l), u = f + 1;
              }
            }
          else {
            for (var _ = new Array(i), c = 0; c < i; ++c)
              _[c] = String.fromCharCode(P[o + c]);
            s = _.join("");
          }
          return W(n), s;
        },
        toWireType: function(n, i) {
          i instanceof ArrayBuffer && (i = new Uint8Array(i));
          var o, s = typeof i == "string";
          s || i instanceof Uint8Array || i instanceof Uint8ClampedArray || i instanceof Int8Array || v("Cannot pass non-string to std::string"), t && s ? o = Rr(i) : o = i.length;
          var u = ge(4 + o + 1), c = u + 4;
          if (h[u >> 2] = o, t && s)
            xr(i, c, o + 1);
          else if (s)
            for (var f = 0; f < o; ++f) {
              var d = i.charCodeAt(f);
              d > 255 && (W(c), v("String has UTF-16 code units that do not fit in 8 bits")), P[c + f] = d;
            }
          else
            for (var f = 0; f < o; ++f)
              P[c + f] = i[f];
          return n !== null && n.push(W, u), u;
        },
        argPackAdvance: 8,
        readValueFromPointer: he,
        destructorFunction: function(n) {
          W(n);
        }
      });
    }
    function Nt(e, r, t) {
      t = m(t);
      var n, i, o, s, u;
      r === 2 ? (n = Er, i = Sr, s = Dr, o = () => ce, u = 1) : r === 4 && (n = Wr, i = Or, s = Ur, o = () => h, u = 2), H(e, {
        name: t,
        fromWireType: function(c) {
          for (var f = h[c >> 2], d = o(), l, _ = c + 4, p = 0; p <= f; ++p) {
            var g = c + 4 + p * r;
            if (p == f || d[g >> u] == 0) {
              var T = g - _, O = n(_, T);
              l === void 0 ? l = O : (l += String.fromCharCode(0), l += O), _ = g + r;
            }
          }
          return W(c), l;
        },
        toWireType: function(c, f) {
          typeof f != "string" && v("Cannot pass non-string to C++ string type " + t);
          var d = s(f), l = ge(4 + d + r);
          return h[l >> 2] = d >> u, i(f, l + 4, d + r), c !== null && c.push(W, l), l;
        },
        argPackAdvance: 8,
        readValueFromPointer: he,
        destructorFunction: function(c) {
          W(c);
        }
      });
    }
    function Qt(e, r) {
      r = m(r), H(e, {
        isVoid: !0,
        // void return values can be optimized out sometimes
        name: r,
        argPackAdvance: 0,
        fromWireType: function() {
        },
        toWireType: function(t, n) {
        }
      });
    }
    function Se(e, r) {
      var t = q[e];
      return t === void 0 && v(r + " has unknown type " + sr(e)), t;
    }
    function Yt(e, r, t) {
      e = y.toValue(e), r = Se(r, "emval::as");
      var n = [], i = y.toHandle(n);
      return h[t >> 2] = i, r.toWireType(n, e);
    }
    function _r(e, r) {
      for (var t = new Array(e), n = 0; n < e; ++n)
        t[n] = Se(
          h[r + n * Tr >> 2],
          "parameter " + n
        );
      return t;
    }
    function Kt(e, r, t, n) {
      e = y.toValue(e);
      for (var i = _r(r, t), o = new Array(r), s = 0; s < r; ++s) {
        var u = i[s];
        o[s] = u.readValueFromPointer(n), n += u.argPackAdvance;
      }
      var c = e.apply(void 0, o);
      return y.toHandle(c);
    }
    function Xt(e) {
      var r = [];
      return h[e >> 2] = y.toHandle(r), r;
    }
    var en = {};
    function dr(e) {
      var r = en[e];
      return r === void 0 ? m(e) : r;
    }
    var De = [];
    function rn(e, r, t, n, i) {
      return e = De[e], r = y.toValue(r), t = dr(t), e(r, t, Xt(n), i);
    }
    function tn(e) {
      var r = De.length;
      return De.push(e), r;
    }
    var vr = [];
    function nn(e, r) {
      var t = _r(e, r), n = t[0], i = n.name + "_$" + t.slice(1).map(function(g) {
        return g.name;
      }).join("_") + "$", o = vr[i];
      if (o !== void 0)
        return o;
      for (var s = ["retType"], u = [n], c = "", f = 0; f < e - 1; ++f)
        c += (f !== 0 ? ", " : "") + "arg" + f, s.push("argType" + f), u.push(t[1 + f]);
      for (var d = de("methodCaller_" + i), l = "return function " + d + `(handle, name, destructors, args) {
`, _ = 0, f = 0; f < e - 1; ++f)
        l += "    var arg" + f + " = argType" + f + ".readValueFromPointer(args" + (_ ? "+" + _ : "") + `);
`, _ += t[f + 1].argPackAdvance;
      l += "    var rv = handle[name](" + c + `);
`;
      for (var f = 0; f < e - 1; ++f)
        t[f + 1].deleteObject && (l += "    argType" + f + ".deleteObject(arg" + f + `);
`);
      n.isVoid || (l += `    return retType.toWireType(destructors, rv);
`), l += `};
`, s.push(l);
      var p = ur(Function, s).apply(null, u);
      return o = tn(p), vr[i] = o, o;
    }
    function an(e, r) {
      return e = y.toValue(e), r = y.toValue(r), y.toHandle(e[r]);
    }
    function on(e) {
      e > 4 && (E[e].refcount += 1);
    }
    function sn(e) {
      return y.toHandle(dr(e));
    }
    function un(e) {
      var r = y.toValue(e);
      cr(r), Re(e);
    }
    function cn(e, r) {
      e = Se(e, "_emval_take_value");
      var t = e.readValueFromPointer(r);
      return y.toHandle(t);
    }
    function fn() {
      ee("");
    }
    function ln(e, r, t) {
      P.copyWithin(e, r, r + t);
    }
    function _n() {
      return 2147483648;
    }
    function dn(e) {
      try {
        return ue.grow(e - ye.byteLength + 65535 >>> 16), Le(ue.buffer), 1;
      } catch {
      }
    }
    function vn(e) {
      var r = P.length;
      e = e >>> 0;
      var t = _n();
      if (e > t)
        return !1;
      let n = (c, f) => c + (f - c % f) % f;
      for (var i = 1; i <= 4; i *= 2) {
        var o = r * (1 + 0.2 / i);
        o = Math.min(o, e + 100663296);
        var s = Math.min(t, n(Math.max(e, o), 65536)), u = dn(s);
        if (u)
          return !0;
      }
      return !1;
    }
    function pn() {
      return Cr();
    }
    at(), te = a.BindingError = Fe(Error, "BindingError"), Ke = a.InternalError = Fe(Error, "InternalError"), Ft(), pt(), Et(), or = a.UnboundTypeError = Fe(Error, "UnboundTypeError"), jt();
    var pr = {
      __cxa_allocate_exception: Zr,
      __cxa_begin_catch: Qr,
      __cxa_end_catch: Kr,
      __cxa_find_matching_catch_2: et,
      __cxa_find_matching_catch_3: rt,
      __cxa_free_exception: Qe,
      __cxa_rethrow: tt,
      __cxa_throw: nt,
      __resumeException: Xr,
      _embind_register_bigint: it,
      _embind_register_bool: ut,
      _embind_register_class: Ot,
      _embind_register_class_function: Ut,
      _embind_register_emval: Vt,
      _embind_register_float: Bt,
      _embind_register_function: Lt,
      _embind_register_integer: Gt,
      _embind_register_memory_view: Jt,
      _embind_register_smart_ptr: zt,
      _embind_register_std_string: Zt,
      _embind_register_std_wstring: Nt,
      _embind_register_void: Qt,
      _emval_as: Yt,
      _emval_call: Kt,
      _emval_call_method: rn,
      _emval_decref: Re,
      _emval_get_method_caller: nn,
      _emval_get_property: an,
      _emval_incref: on,
      _emval_new_cstring: sn,
      _emval_run_destructors: un,
      _emval_take_value: cn,
      abort: fn,
      emscripten_memcpy_big: ln,
      emscripten_resize_heap: vn,
      getTempRet0: pn,
      invoke_id: Fn,
      invoke_ii: wn,
      invoke_iii: hn,
      invoke_iiii: mn,
      invoke_iiiii: $n,
      invoke_v: Cn,
      invoke_vi: Pn,
      invoke_vid: Tn,
      invoke_vii: yn,
      invoke_viii: gn,
      invoke_viiii: bn
    };
    zr(), a.___wasm_call_ctors = function() {
      return (a.___wasm_call_ctors = a.asm.__wasm_call_ctors).apply(null, arguments);
    };
    var W = a._free = function() {
      return (W = a._free = a.asm.free).apply(null, arguments);
    }, hr = a.___getTypeName = function() {
      return (hr = a.___getTypeName = a.asm.__getTypeName).apply(null, arguments);
    };
    a.___embind_register_native_and_builtin_types = function() {
      return (a.___embind_register_native_and_builtin_types = a.asm.__embind_register_native_and_builtin_types).apply(null, arguments);
    }, a.___errno_location = function() {
      return (a.___errno_location = a.asm.__errno_location).apply(null, arguments);
    };
    var ge = a._malloc = function() {
      return (ge = a._malloc = a.asm.malloc).apply(null, arguments);
    }, F = a._setThrew = function() {
      return (F = a._setThrew = a.asm.setThrew).apply(null, arguments);
    }, A = a.stackSave = function() {
      return (A = a.stackSave = a.asm.stackSave).apply(null, arguments);
    }, k = a.stackRestore = function() {
      return (k = a.stackRestore = a.asm.stackRestore).apply(null, arguments);
    };
    a.stackAlloc = function() {
      return (a.stackAlloc = a.asm.stackAlloc).apply(null, arguments);
    };
    var We = a.___cxa_can_catch = function() {
      return (We = a.___cxa_can_catch = a.asm.__cxa_can_catch).apply(null, arguments);
    }, gr = a.___cxa_is_pointer_type = function() {
      return (gr = a.___cxa_is_pointer_type = a.asm.__cxa_is_pointer_type).apply(null, arguments);
    };
    function hn(e, r, t) {
      var n = A();
      try {
        return b(e)(r, t);
      } catch (i) {
        if (k(n), i !== i + 0)
          throw i;
        F(1, 0);
      }
    }
    function gn(e, r, t, n) {
      var i = A();
      try {
        b(e)(r, t, n);
      } catch (o) {
        if (k(i), o !== o + 0)
          throw o;
        F(1, 0);
      }
    }
    function mn(e, r, t, n) {
      var i = A();
      try {
        return b(e)(r, t, n);
      } catch (o) {
        if (k(i), o !== o + 0)
          throw o;
        F(1, 0);
      }
    }
    function yn(e, r, t) {
      var n = A();
      try {
        b(e)(r, t);
      } catch (i) {
        if (k(n), i !== i + 0)
          throw i;
        F(1, 0);
      }
    }
    function bn(e, r, t, n, i) {
      var o = A();
      try {
        b(e)(r, t, n, i);
      } catch (s) {
        if (k(o), s !== s + 0)
          throw s;
        F(1, 0);
      }
    }
    function wn(e, r) {
      var t = A();
      try {
        return b(e)(r);
      } catch (n) {
        if (k(t), n !== n + 0)
          throw n;
        F(1, 0);
      }
    }
    function Pn(e, r) {
      var t = A();
      try {
        b(e)(r);
      } catch (n) {
        if (k(t), n !== n + 0)
          throw n;
        F(1, 0);
      }
    }
    function Fn(e, r) {
      var t = A();
      try {
        return b(e)(r);
      } catch (n) {
        if (k(t), n !== n + 0)
          throw n;
        F(1, 0);
      }
    }
    function Tn(e, r, t) {
      var n = A();
      try {
        b(e)(r, t);
      } catch (i) {
        if (k(n), i !== i + 0)
          throw i;
        F(1, 0);
      }
    }
    function Cn(e) {
      var r = A();
      try {
        b(e)();
      } catch (t) {
        if (k(r), t !== t + 0)
          throw t;
        F(1, 0);
      }
    }
    function $n(e, r, t, n, i) {
      var o = A();
      try {
        return b(e)(r, t, n, i);
      } catch (s) {
        if (k(o), s !== s + 0)
          throw s;
        F(1, 0);
      }
    }
    var me;
    X = function e() {
      me || Oe(), me || (X = e);
    };
    function Oe(e) {
      if (B > 0 || (Hr(), B > 0))
        return;
      function r() {
        me || (me = !0, a.calledRun = !0, !Ie && (Ir(), I(a), a.onRuntimeInitialized && a.onRuntimeInitialized(), jr()));
      }
      a.setStatus ? (a.setStatus("Running..."), setTimeout(function() {
        setTimeout(function() {
          a.setStatus("");
        }, 1), r();
      }, 1)) : r();
    }
    if (a.run = Oe, a.preInit)
      for (typeof a.preInit == "function" && (a.preInit = [a.preInit]); a.preInit.length > 0; )
        a.preInit.pop()();
    return Oe(), x.ready;
  };
})();
const N = class {
  constructor(w, x, a) {
    this._encoder = void 0, this._generator = w, this._encoder = N.module.makeEncoder(this._fillPixelsCallback.bind(this), x, a);
  }
  static async init(w) {
    return new Promise(async (x, a) => {
      const I = await xn({
        locateFile: (C) => w || C
      }).then((C) => C).catch((C) => {
        console.error(C);
      });
      I && (N.module = I, window.mainModule = I), N.module ? x(this.module) : a("!!!Load Wasm Error!!!");
    });
  }
  configJPEG(w) {
    this._encoder.configJPEG(w);
  }
  execute() {
    this._encoder.execute();
  }
  _fillPixelsCallback(w, x, a, I) {
    let C = this._generator(w, x, a, I), Q = N.module._malloc(C.length);
    return N.module.HEAPU8.set(C, Q), Q;
  }
};
let Rn = N;
Rn.module = void 0;
export {
  kn as Configure,
  En as JpegConfigure,
  Rn as TilesImageEncoder
};

(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value)) {
    return value;
  } else if (isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*.*?\*\//gs;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
    }
  }
  get active() {
    return this._active;
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function recordEffectScope(effect, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
const createDep = (effects) => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
const newTracked = (dep) => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({ deps }) => {
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit;
    }
  }
};
const finalizeDepMarkers = (effect) => {
  const { deps } = effect;
  if (deps.length) {
    let ptr = 0;
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect);
      } else {
        deps[ptr++] = dep;
      }
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};
const targetMap = /* @__PURE__ */ new WeakMap();
let effectTrackDepth = 0;
let trackOpBit = 1;
const maxMarkerBits = 30;
let activeEffect;
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
class ReactiveEffect {
  constructor(fn, scheduler = null, scope) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this.parent = void 0;
    recordEffectScope(this, scope);
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    let parent = activeEffect;
    let lastShouldTrack = shouldTrack;
    while (parent) {
      if (parent === this) {
        return;
      }
      parent = parent.parent;
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      shouldTrack = true;
      trackOpBit = 1 << ++effectTrackDepth;
      if (effectTrackDepth <= maxMarkerBits) {
        initDepMarkers(this);
      } else {
        cleanupEffect(this);
      }
      return this.fn();
    } finally {
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this);
      }
      trackOpBit = 1 << --effectTrackDepth;
      activeEffect = this.parent;
      shouldTrack = lastShouldTrack;
      this.parent = void 0;
      if (this.deferStop) {
        this.stop();
      }
    }
  }
  stop() {
    if (activeEffect === this) {
      this.deferStop = true;
    } else if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect) {
  const { deps } = effect;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect);
    }
    deps.length = 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep());
    }
    trackEffects(dep);
  }
}
function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack2 = false;
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit;
      shouldTrack2 = !wasTracked(dep);
    }
  } else {
    shouldTrack2 = !dep.has(activeEffect);
  }
  if (shouldTrack2) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  if (deps.length === 1) {
    if (deps[0]) {
      {
        triggerEffects(deps[0]);
      }
    }
  } else {
    const effects = [];
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }
    {
      triggerEffects(createDep(effects));
    }
  }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
  const effects = isArray(dep) ? dep : [...dep];
  for (const effect of effects) {
    if (effect.computed) {
      triggerEffect(effect);
    }
  }
  for (const effect of effects) {
    if (!effect.computed) {
      triggerEffect(effect);
    }
  }
}
function triggerEffect(effect, debuggerEventExtraInfo) {
  if (effect !== activeEffect || effect.allowRecurse) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const get$1 = /* @__PURE__ */ createGetter();
const shallowGet = /* @__PURE__ */ createGetter(false, true);
const readonlyGet = /* @__PURE__ */ createGetter(true);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty(key) {
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
function createGetter(isReadonly2 = false, shallow = false) {
  return function get2(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return shallow;
    } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  };
}
const set$1 = /* @__PURE__ */ createSetter();
const shallowSet = /* @__PURE__ */ createSetter(true);
function createSetter(shallow = false) {
  return function set2(target, key, value, receiver) {
    let oldValue = target[key];
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }
    if (!shallow) {
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key);
  target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function has$1(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys(target) {
  track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
const mutableHandlers = {
  get: get$1,
  set: set$1,
  deleteProperty,
  has: has$1,
  ownKeys
};
const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    return true;
  },
  deleteProperty(target, key) {
    return true;
  }
};
const shallowReactiveHandlers = /* @__PURE__ */ extend({}, mutableHandlers, {
  get: shallowGet,
  set: shallowSet
});
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target[
    "__v_raw"
    /* ReactiveFlags.RAW */
  ];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has(key, isReadonly2 = false) {
  const target = this[
    "__v_raw"
    /* ReactiveFlags.RAW */
  ];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target[
    "__v_raw"
    /* ReactiveFlags.RAW */
  ];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed[
      "__v_raw"
      /* ReactiveFlags.RAW */
    ];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this[
      "__v_raw"
      /* ReactiveFlags.RAW */
    ];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get(this, key);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod(
      "add"
      /* TriggerOpTypes.ADD */
    ),
    set: createReadonlyMethod(
      "set"
      /* TriggerOpTypes.SET */
    ),
    delete: createReadonlyMethod(
      "delete"
      /* TriggerOpTypes.DELETE */
    ),
    clear: createReadonlyMethod(
      "clear"
      /* TriggerOpTypes.CLEAR */
    ),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod(
      "add"
      /* TriggerOpTypes.ADD */
    ),
    set: createReadonlyMethod(
      "set"
      /* TriggerOpTypes.SET */
    ),
    delete: createReadonlyMethod(
      "delete"
      /* TriggerOpTypes.DELETE */
    ),
    clear: createReadonlyMethod(
      "clear"
      /* TriggerOpTypes.CLEAR */
    ),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value[
    "__v_skip"
    /* ReactiveFlags.SKIP */
  ] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
}
function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    return target;
  }
  if (target[
    "__v_raw"
    /* ReactiveFlags.RAW */
  ] && !(isReadonly2 && target[
    "__v_isReactive"
    /* ReactiveFlags.IS_REACTIVE */
  ])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value[
      "__v_raw"
      /* ReactiveFlags.RAW */
    ]);
  }
  return !!(value && value[
    "__v_isReactive"
    /* ReactiveFlags.IS_REACTIVE */
  ]);
}
function isReadonly(value) {
  return !!(value && value[
    "__v_isReadonly"
    /* ReactiveFlags.IS_READONLY */
  ]);
}
function isShallow(value) {
  return !!(value && value[
    "__v_isShallow"
    /* ReactiveFlags.IS_SHALLOW */
  ]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed[
    "__v_raw"
    /* ReactiveFlags.RAW */
  ];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  def(value, "__v_skip", true);
  return value;
}
const toReactive = (value) => isObject(value) ? reactive(value) : value;
const toReadonly = (value) => isObject(value) ? readonly(value) : value;
function trackRefValue(ref2) {
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    {
      trackEffects(ref2.dep || (ref2.dep = createDep()));
    }
  }
}
function triggerRefValue(ref2, newVal) {
  ref2 = toRaw(ref2);
  const dep = ref2.dep;
  if (dep) {
    {
      triggerEffects(dep);
    }
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
var _a$1;
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this[_a$1] = false;
    this._dirty = true;
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this[
      "__v_isReadonly"
      /* ReactiveFlags.IS_READONLY */
    ] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    trackRefValue(self2);
    if (self2._dirty || !self2._cacheable) {
      self2._dirty = false;
      self2._value = self2.effect.run();
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
}
_a$1 = "__v_isReadonly";
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
function warn(msg, ...args) {
  return;
}
function callWithErrorHandling(fn, instance, type, args) {
  let res;
  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
  return res;
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(appErrorHandler, null, 10, [err, exposedInstance, errorInfo]);
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJobId = getId(queue[middle]);
    middleJobId < id ? start = middle + 1 : end = middle;
  }
  return start;
}
function queueJob(job) {
  if (!queue.length || !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(cb, cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex)) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(seen, i = isFlushing ? flushIndex + 1 : 0) {
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.pre) {
      queue.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    activePostFlushCbs.sort((a, b) => getId(a) - getId(b));
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a, b) => {
  const diff = getId(a) - getId(b);
  if (diff === 0) {
    if (a.pre && !b.pre)
      return -1;
    if (b.pre && !a.pre)
      return 1;
  }
  return diff;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  queue.sort(comparator);
  const check = NOOP;
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (false)
          ;
        callWithErrorHandling(
          job,
          null,
          14
          /* ErrorCodes.SCHEDULER */
        );
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim: trim2 } = props[modifiersKey] || EMPTY_OBJ;
    if (trim2) {
      args = rawArgs.map((a) => isString(a) ? a.trim() : a);
    }
    if (number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(handler, instance, 6, args);
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(onceHandler, instance, 6, args);
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx)
    return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    let res;
    try {
      res = fn(...args);
    } finally {
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const { type: Component, vnode, proxy, withProxy, props, propsOptions: [propsOptions], slots, attrs, emit: emit2, render, renderCache, data, setupState, ctx, inheritAttrs } = instance;
  let result;
  let fallthroughAttrs;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      result = normalizeVNode(render.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
      fallthroughAttrs = attrs;
    } else {
      const render2 = Component;
      if (false)
        ;
      result = normalizeVNode(render2.length > 1 ? render2(props, false ? {
        get attrs() {
          markAttrsAccessed();
          return attrs;
        },
        slots,
        emit: emit2
      } : { attrs, slots, emit: emit2 }) : render2(
        props,
        null
        /* we know it doesn't need it */
      ));
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(
      err,
      instance,
      1
      /* ErrorCodes.RENDER_FUNCTION */
    );
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
        }
        root = cloneVNode(root, fallthroughAttrs);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    root.transition = vnode.transition;
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent && parent.subTree === vnode) {
    (vnode = parent.vnode).el = el;
    parent = parent.parent;
  }
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
function provide(key, value) {
  if (!currentInstance)
    ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance) {
    const provides = instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance.proxy) : defaultValue;
    } else
      ;
  }
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
  const instance = getCurrentScope() === (currentInstance === null || currentInstance === void 0 ? void 0 : currentInstance.scope) ? currentInstance : null;
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return traverse(s);
      } else if (isFunction(s)) {
        return callWithErrorHandling(
          s,
          instance,
          2
          /* ErrorCodes.WATCH_GETTER */
        );
      } else
        ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(
        source,
        instance,
        2
        /* ErrorCodes.WATCH_GETTER */
      );
    } else {
      getter = () => {
        if (instance && instance.isUnmounted) {
          return;
        }
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(source, instance, 3, [onCleanup]);
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect.onStop = () => {
      callWithErrorHandling(
        fn,
        instance,
        4
        /* ErrorCodes.WATCH_CLEANUP */
      );
    };
  };
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else {
      return NOOP;
    }
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect.active) {
      return;
    }
    if (cb) {
      const newValue = effect.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect = new ReactiveEffect(getter, scheduler);
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(effect.run.bind(effect), instance && instance.suspense);
  } else {
    effect.run();
  }
  const unwatch = () => {
    effect.stop();
    if (instance && instance.scope) {
      remove(instance.scope.effects, effect);
    }
  };
  if (ssrCleanup)
    ssrCleanup.push(unwatch);
  return unwatch;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const cur = currentInstance;
  setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  if (cur) {
    setCurrentInstance(cur);
  } else {
    unsetCurrentInstance();
  }
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, seen) {
  if (!isObject(value) || value[
    "__v_skip"
    /* ReactiveFlags.SKIP */
  ]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], seen);
    }
  }
  return value;
}
function useTransitionState() {
  const state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  onMounted(() => {
    state.isMounted = true;
  });
  onBeforeUnmount(() => {
    state.isUnmounting = true;
  });
  return state;
}
const TransitionHookValidator = [Function, Array];
const BaseTransitionImpl = {
  name: `BaseTransition`,
  props: {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    // enter
    onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    // leave
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    // appear
    onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator
  },
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    let prevTransitionKey;
    return () => {
      const children = slots.default && getTransitionRawChildren(slots.default(), true);
      if (!children || !children.length) {
        return;
      }
      let child = children[0];
      if (children.length > 1) {
        for (const c of children) {
          if (c.type !== Comment) {
            child = c;
            break;
          }
        }
      }
      const rawProps = toRaw(props);
      const { mode } = rawProps;
      if (state.isLeaving) {
        return emptyPlaceholder(child);
      }
      const innerChild = getKeepAliveChild(child);
      if (!innerChild) {
        return emptyPlaceholder(child);
      }
      const enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance);
      setTransitionHooks(innerChild, enterHooks);
      const oldChild = instance.subTree;
      const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
      let transitionKeyChanged = false;
      const { getTransitionKey } = innerChild.type;
      if (getTransitionKey) {
        const key = getTransitionKey();
        if (prevTransitionKey === void 0) {
          prevTransitionKey = key;
        } else if (key !== prevTransitionKey) {
          prevTransitionKey = key;
          transitionKeyChanged = true;
        }
      }
      if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
        const leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance);
        setTransitionHooks(oldInnerChild, leavingHooks);
        if (mode === "out-in") {
          state.isLeaving = true;
          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            if (instance.update.active !== false) {
              instance.update();
            }
          };
          return emptyPlaceholder(child);
        } else if (mode === "in-out" && innerChild.type !== Comment) {
          leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
            el._leaveCb = () => {
              earlyRemove();
              el._leaveCb = void 0;
              delete enterHooks.delayedLeave;
            };
            enterHooks.delayedLeave = delayedLeave;
          };
        }
      }
      return child;
    };
  }
};
const BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
  const { leavingVNodes } = state;
  let leavingVNodesCache = leavingVNodes.get(vnode.type);
  if (!leavingVNodesCache) {
    leavingVNodesCache = /* @__PURE__ */ Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }
  return leavingVNodesCache;
}
function resolveTransitionHooks(vnode, props, state, instance) {
  const { appear, mode, persisted = false, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, onBeforeAppear, onAppear, onAfterAppear, onAppearCancelled } = props;
  const key = String(vnode.key);
  const leavingVNodesCache = getLeavingNodesForType(state, vnode);
  const callHook2 = (hook, args) => {
    hook && callWithAsyncErrorHandling(hook, instance, 9, args);
  };
  const callAsyncHook = (hook, args) => {
    const done = args[1];
    callHook2(hook, args);
    if (isArray(hook)) {
      if (hook.every((hook2) => hook2.length <= 1))
        done();
    } else if (hook.length <= 1) {
      done();
    }
  };
  const hooks = {
    mode,
    persisted,
    beforeEnter(el) {
      let hook = onBeforeEnter;
      if (!state.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter;
        } else {
          return;
        }
      }
      if (el._leaveCb) {
        el._leaveCb(
          true
          /* cancelled */
        );
      }
      const leavingVNode = leavingVNodesCache[key];
      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
        leavingVNode.el._leaveCb();
      }
      callHook2(hook, [el]);
    },
    enter(el) {
      let hook = onEnter;
      let afterHook = onAfterEnter;
      let cancelHook = onEnterCancelled;
      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }
      let called = false;
      const done = el._enterCb = (cancelled) => {
        if (called)
          return;
        called = true;
        if (cancelled) {
          callHook2(cancelHook, [el]);
        } else {
          callHook2(afterHook, [el]);
        }
        if (hooks.delayedLeave) {
          hooks.delayedLeave();
        }
        el._enterCb = void 0;
      };
      if (hook) {
        callAsyncHook(hook, [el, done]);
      } else {
        done();
      }
    },
    leave(el, remove2) {
      const key2 = String(vnode.key);
      if (el._enterCb) {
        el._enterCb(
          true
          /* cancelled */
        );
      }
      if (state.isUnmounting) {
        return remove2();
      }
      callHook2(onBeforeLeave, [el]);
      let called = false;
      const done = el._leaveCb = (cancelled) => {
        if (called)
          return;
        called = true;
        remove2();
        if (cancelled) {
          callHook2(onLeaveCancelled, [el]);
        } else {
          callHook2(onAfterLeave, [el]);
        }
        el._leaveCb = void 0;
        if (leavingVNodesCache[key2] === vnode) {
          delete leavingVNodesCache[key2];
        }
      };
      leavingVNodesCache[key2] = vnode;
      if (onLeave) {
        callAsyncHook(onLeave, [el, done]);
      } else {
        done();
      }
    },
    clone(vnode2) {
      return resolveTransitionHooks(vnode2, props, state, instance);
    }
  };
  return hooks;
}
function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode);
    vnode.children = null;
    return vnode;
  }
}
function getKeepAliveChild(vnode) {
  return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : void 0 : vnode;
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
function getTransitionRawChildren(children, keepComment = false, parentKey) {
  let ret = [];
  let keyedFragmentCount = 0;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
    if (child.type === Fragment) {
      if (child.patchFlag & 128)
        keyedFragmentCount++;
      ret = ret.concat(getTransitionRawChildren(child.children, keepComment, key));
    } else if (keepComment || child.type !== Comment) {
      ret.push(key != null ? cloneVNode(child, { key }) : child);
    }
  }
  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = -2;
    }
  }
  return ret;
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      unsetCurrentInstance();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
);
const onBeforeMount = createHook(
  "bm"
  /* LifecycleHooks.BEFORE_MOUNT */
);
const onMounted = createHook(
  "m"
  /* LifecycleHooks.MOUNTED */
);
const onBeforeUpdate = createHook(
  "bu"
  /* LifecycleHooks.BEFORE_UPDATE */
);
const onUpdated = createHook(
  "u"
  /* LifecycleHooks.UPDATED */
);
const onBeforeUnmount = createHook(
  "bum"
  /* LifecycleHooks.BEFORE_UNMOUNT */
);
const onUnmounted = createHook(
  "um"
  /* LifecycleHooks.UNMOUNTED */
);
const onServerPrefetch = createHook(
  "sp"
  /* LifecycleHooks.SERVER_PREFETCH */
);
const onRenderTriggered = createHook(
  "rtg"
  /* LifecycleHooks.RENDER_TRIGGERED */
);
const onRenderTracked = createHook(
  "rtc"
  /* LifecycleHooks.RENDER_TRACKED */
);
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
function withDirectives(vnode, directives) {
  const internalInstance = currentRenderingInstance;
  if (internalInstance === null) {
    return vnode;
  }
  const instance = getExposeProxy(internalInstance) || internalInstance.proxy;
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (dir) {
      if (isFunction(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }
      if (dir.deep) {
        traverse(value);
      }
      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      });
    }
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
const NULL_DYNAMIC_COMPONENT = Symbol();
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => i.props,
    $attrs: (i) => i.attrs,
    $slots: (i) => i.slots,
    $refs: (i) => i.refs,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => queueJob(i.update)),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) => instanceWatch.bind(i)
  })
);
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else
      ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({ _: { data, setupState, accessCache, ctx, appContext, propsOptions } }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook(
      options.beforeCreate,
      instance,
      "bc"
      /* LifecycleHooks.BEFORE_CREATE */
    );
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties, instance.appContext.config.unwrapInjectedRef);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject(data))
      ;
    else {
      instance.data = reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook(
      created,
      instance,
      "c"
      /* LifecycleHooks.CREATED */
    );
  }
  function registerLifecycleHook(register, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP, unwrapRef = false) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
          /* treat default function as factory */
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      if (unwrapRef) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: (v) => injected.value = v
        });
      } else {
        ctx[key] = injected;
      }
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook(hook, instance, type) {
  callWithAsyncErrorHandling(isArray(hook) ? hook.map((h) => h.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject(raw)) {
    if (isArray(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else
    ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach((m) => mergeOptions(resolved, m, optionMergeStrategies, true));
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach((m) => mergeOptions(to, m, strats, true));
  }
  for (const key in from) {
    if (asMixin && key === "expose")
      ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeObjectOptions,
  emits: mergeObjectOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(isFunction(to) ? to.call(this, this) : to, isFunction(from) ? from.call(this, this) : from);
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(extend(/* @__PURE__ */ Object.create(null), to), from) : from;
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  def(attrs, InternalObjectKey, 1);
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const { props, attrs, vnode: { patchFlag } } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
              /* isAbsent */
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
              /* isAbsent */
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance, "set", "$attrs");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !hasOwn(castValues, key));
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(null, props);
          unsetCurrentInstance();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[
      0
      /* BooleanFlags.shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* BooleanFlags.shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : Object.assign({}, opt);
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[
            0
            /* BooleanFlags.shouldCast */
          ] = booleanIndex > -1;
          prop[
            1
            /* BooleanFlags.shouldCastTrue */
          ] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$") {
    return true;
  }
  return false;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*(function|class) (\w+)/);
  return match ? match[2] : ctor === null ? "null" : "";
}
function isSameType(a, b) {
  return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray(expectedTypes)) {
    return expectedTypes.findIndex((t) => isSameType(t, type));
  } else if (isFunction(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if (false)
      ;
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key))
      continue;
    const value = rawSlots[key];
    if (isFunction(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const initSlots = (instance, children) => {
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      instance.slots = toRaw(children);
      def(children, "_", type);
    } else {
      normalizeObjectSlots(children, instance.slots = {});
    }
  } else {
    instance.slots = {};
    if (children) {
      normalizeVNodeSlots(instance, children);
    }
  }
  def(instance.slots, InternalObjectKey, 1);
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        extend(slots, children);
        if (!optimized && type === 1) {
          delete slots._;
        }
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
        delete slots[key];
      }
    }
  }
};
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = Object.assign({}, rootComponent);
    }
    if (rootProps != null && !isObject(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new Set();
    let isMounted = false;
    const app = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin))
          ;
        else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app, ...options);
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin);
          plugin(app, ...options);
        } else
          ;
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app;
      },
      mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
          const vnode = createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render(vnode, rootContainer, isSVG);
          }
          isMounted = true;
          app._container = rootContainer;
          rootContainer.__vue_app__ = app;
          return getExposeProxy(vnode.component) || vnode.component.proxy;
        }
      },
      unmount() {
        if (isMounted) {
          render(null, app._container);
          delete app._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app;
      }
    };
    return app;
  };
}
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray(rawRef)) {
    rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref2 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref2) {
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction(ref2)) {
    callWithErrorHandling(ref2, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref2);
    const _isRef = isRef(ref2);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? hasOwn(setupState, ref2) ? setupState[ref2] : refs[ref2] : ref2.value;
          if (isUnmount) {
            isArray(existing) && remove(existing, refValue);
          } else {
            if (!isArray(existing)) {
              if (_isString) {
                refs[ref2] = [refValue];
                if (hasOwn(setupState, ref2)) {
                  setupState[ref2] = refs[ref2];
                }
              } else {
                ref2.value = [refValue];
                if (rawRef.k)
                  refs[rawRef.k] = ref2.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref2] = value;
          if (hasOwn(setupState, ref2)) {
            setupState[ref2] = value;
          }
        } else if (_isRef) {
          ref2.value = value;
          if (rawRef.k)
            refs[rawRef.k] = value;
        } else
          ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, insertStaticContent: hostInsertStaticContent } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref2, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, isSVG);
        }
        break;
      case Fragment:
        processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        break;
      default:
        if (shapeFlag & 1) {
          processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 6) {
          processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 64) {
          type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else if (shapeFlag & 128) {
          type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else
          ;
    }
    if (ref2 != null && parentComponent) {
      setRef(ref2, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, isSVG) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG, n2.el, n2.anchor);
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    isSVG = isSVG || n2.type === "svg";
    if (n1 == null) {
      mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      patchElement(n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { type, props, shapeFlag, transition, dirs } = vnode;
    el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is, props);
    if (shapeFlag & 8) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(vnode.children, el, null, parentComponent, parentSuspense, isSVG && type !== "foreignObject", slotScopeIds, optimized);
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (props) {
      for (const key in props) {
        if (key !== "value" && !isReservedProp(key)) {
          hostPatchProp(el, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
        }
      }
      if ("value" in props) {
        hostPatchProp(el, "value", null, props.value);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    const areChildrenSVG = isSVG && n2.type !== "foreignObject";
    if (dynamicChildren) {
      patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds);
    } else if (!optimized) {
      patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds, false);
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, isSVG);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, isSVG);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(el, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          fallbackContainer
        )
      );
      patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, true);
    }
  };
  const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
      }
      for (const key in newProps) {
        if (isReservedProp(key))
          continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(n2.children, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG, slotScopeIds);
        if (
          // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree
        ) {
          traverseStaticChildren(
            n1,
            n2,
            true
            /* shallow */
          );
        }
      } else {
        patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
      } else {
        mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
      return;
    }
    setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized);
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        if (el && hydrateNode) {
          const hydrateSubTree = () => {
            instance.subTree = renderComponentRoot(instance);
            hydrateNode(el, instance.subTree, instance, parentSuspense, null);
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(
              // note: we are moving the render call into an async callback,
              // which means it won't track dependencies - but it's ok because
              // a server-rendered async wrapper is already in resolved state
              // and it will never need to change.
              () => !instance.isUnmounted && hydrateSubTree()
            );
          } else {
            hydrateSubTree();
          }
        } else {
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el),
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          isSVG
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
        }
      }
    };
    const effect = instance.effect = new ReactiveEffect(
      componentUpdateFn,
      () => queueJob(update),
      instance.scope
      // track it in component's effect scope
    );
    const update = instance.update = () => effect.run();
    update.id = instance.uid;
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs();
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
    if (oldLength > newLength) {
      unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
    } else {
      mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, commonLength);
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++)
        newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(
              nextChild,
              container,
              anchor,
              2
              /* MoveType.REORDER */
            );
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove3 = () => hostInsert(el, container, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove3();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove3, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const { type, props, ref: ref2, children, dynamicChildren, shapeFlag, patchFlag, dirs } = vnode;
    if (ref2 != null) {
      setRef(ref2, null, parentSuspense, vnode, true);
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(vnode, parentComponent, parentSuspense, optimized, internals, doRemove);
      } else if (dynamicChildren && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, update, subTree, um } = instance;
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (update) {
      update.active = false;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    return hostNextSibling(vnode.anchor || vnode.el);
  };
  const render = (vnode, container, isSVG) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(container._vnode || null, vnode, container, null, null, null, isSVG);
    }
    flushPreFlushCbs();
    flushPostFlushCbs();
    container._vnode = vnode;
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  let hydrateNode;
  if (createHydrationFns) {
    [hydrate, hydrateNode] = createHydrationFns(internals);
  }
  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  };
}
function toggleRecurse({ effect, update }, allowed) {
  effect.allowRecurse = update.allowRecurse = allowed;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray(ch1) && isArray(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
const isTeleport = (type) => type.__isTeleport;
const Fragment = Symbol(void 0);
const Text = Symbol(void 0);
const Comment = Symbol(void 0);
const Static = Symbol(void 0);
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    true
    /* isBlock */
  ));
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({ ref: ref2, ref_key, ref_for }) => {
  return ref2 != null ? isString(ref2) || isRef(ref2) || isFunction(ref2) ? { i: currentRenderingInstance, r: ref2, k: ref_key, f: !!ref_for } : ref2 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(
      type,
      props,
      true
      /* mergeRef: true */
    );
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag |= -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject(style)) {
      if (isProxy(style) && !isArray(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
  const { props, ref: ref2, patchFlag, children } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref2 ? isArray(ref2) ? ref2.concat(normalizeRef(extraProps)) : [ref2, normalizeRef(extraProps)] : normalizeRef(extraProps)
    ) : ref2,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx,
    ce: vnode.ce
  };
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray(child)) {
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    );
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !(InternalObjectKey in children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    next: null,
    subTree: null,
    effect: null,
    update: null,
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
const setCurrentInstance = (instance) => {
  currentInstance = instance;
  instance.scope.on();
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  currentInstance = null;
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isInSSRComponentSetup = isSSR;
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isInSSRComponentSetup = false;
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  const { setup } = Component;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(setup, instance, 0, [instance.props, setupContext]);
    resetTracking();
    unsetCurrentInstance();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch((e) => {
          handleError(
            e,
            instance,
            0
            /* ErrorCodes.SETUP_FUNCTION */
          );
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else
    ;
  finishComponentSetup(instance, isSSR);
}
let compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile && !Component.render) {
      const template = Component.template || resolveMergedOptions(instance).template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend(extend({
          isCustomElement,
          delimiters
        }, compilerOptions), componentCompilerOptions);
        Component.render = compile(template, finalCompilerOptions);
      }
    }
    instance.render = Component.render || NOOP;
  }
  {
    setCurrentInstance(instance);
    pauseTracking();
    applyOptions(instance);
    resetTracking();
    unsetCurrentInstance();
  }
}
function createAttrsProxy(instance) {
  return new Proxy(instance.attrs, {
    get(target, key) {
      track(instance, "get", "$attrs");
      return target[key];
    }
  });
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  let attrs;
  {
    return {
      get attrs() {
        return attrs || (attrs = createAttrsProxy(instance));
      },
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  }
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
const ssrContextKey = Symbol(``);
const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);
    return ctx;
  }
};
const version = "3.2.47";
const svgNS = "http://www.w3.org/2000/svg";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, isSVG, is, props) => {
    const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? { is } : void 0);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, isSVG, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling))
          break;
      }
    } else {
      templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
      const template = templateContainer.content;
      if (isSVG) {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      // first
      before ? before.nextSibling : parent.firstChild,
      // last
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
function patchClass(el, value, isSVG) {
  const transitionClasses = el._vtc;
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString(next);
  if (next && !isCssString) {
    if (prev && !isString(prev)) {
      for (const key in prev) {
        if (next[key] == null) {
          setStyle(style, key, "");
        }
      }
    }
    for (const key in next) {
      setStyle(style, key, next[key]);
    }
  } else {
    const currentDisplay = style.display;
    if (isCssString) {
      if (prev !== next) {
        style.cssText = next;
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
    if ("_vod" in el) {
      style.display = currentDisplay;
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null)
      val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean2 = isSpecialBooleanAttr(key);
    if (value == null || isBoolean2 && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, isBoolean2 ? "" : value);
    }
  }
}
function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === "innerHTML" || key === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el[key] = value == null ? "" : value;
    return;
  }
  if (key === "value" && el.tagName !== "PROGRESS" && // custom elements may use _value internally
  !el.tagName.includes("-")) {
    el._value = value;
    const newValue = value == null ? "" : value;
    if (el.value !== newValue || // #4956: always set for OPTION elements because its value falls back to
    // textContent if no value attribute is present. And setting .value for
    // OPTION has no side effect
    el.tagName === "OPTION") {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(key);
}
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el._vei || (el._vei = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(nextValue, instance);
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options];
}
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    if (!e._vts) {
      e._vts = Date.now();
    } else if (e._vts <= invoker.attached) {
      return;
    }
    callWithAsyncErrorHandling(patchStopImmediatePropagation(e, invoker.value), instance, 5, [e]);
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
  } else {
    return value;
  }
}
const nativeOnRE = /^on[a-z]/;
const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && nativeOnRE.test(key) && isFunction(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (nativeOnRE.test(key) && isString(value)) {
    return false;
  }
  return key in el;
}
const DOMTransitionPropsValidators = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: true
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
/* @__PURE__ */ extend({}, BaseTransition.props, DOMTransitionPropsValidators);
const getModelAssigner = (vnode) => {
  const fn = vnode.props["onUpdate:modelValue"] || false;
  return isArray(fn) ? (value) => invokeArrayFns(fn, value) : fn;
};
function onCompositionStart(e) {
  e.target.composing = true;
}
function onCompositionEnd(e) {
  const target = e.target;
  if (target.composing) {
    target.composing = false;
    target.dispatchEvent(new Event("input"));
  }
}
const vModelText = {
  created(el, { modifiers: { lazy, trim: trim2, number } }, vnode) {
    el._assign = getModelAssigner(vnode);
    const castToNumber = number || vnode.props && vnode.props.type === "number";
    addEventListener(el, lazy ? "change" : "input", (e) => {
      if (e.target.composing)
        return;
      let domValue = el.value;
      if (trim2) {
        domValue = domValue.trim();
      }
      if (castToNumber) {
        domValue = looseToNumber(domValue);
      }
      el._assign(domValue);
    });
    if (trim2) {
      addEventListener(el, "change", () => {
        el.value = el.value.trim();
      });
    }
    if (!lazy) {
      addEventListener(el, "compositionstart", onCompositionStart);
      addEventListener(el, "compositionend", onCompositionEnd);
      addEventListener(el, "change", onCompositionEnd);
    }
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(el, { value }) {
    el.value = value == null ? "" : value;
  },
  beforeUpdate(el, { value, modifiers: { lazy, trim: trim2, number } }, vnode) {
    el._assign = getModelAssigner(vnode);
    if (el.composing)
      return;
    if (document.activeElement === el && el.type !== "range") {
      if (lazy) {
        return;
      }
      if (trim2 && el.value.trim() === value) {
        return;
      }
      if ((number || el.type === "number") && looseToNumber(el.value) === value) {
        return;
      }
    }
    const newValue = value == null ? "" : value;
    if (el.value !== newValue) {
      el.value = newValue;
    }
  }
};
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = (...args) => {
  const app = ensureRenderer().createApp(...args);
  const { mount } = app;
  app.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container)
      return;
    const component = app._component;
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    container.innerHTML = "";
    const proxy = mount(container, false, container instanceof SVGElement);
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app;
};
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
var validatorExports = {};
var validator = {
  get exports() {
    return validatorExports;
  },
  set exports(v) {
    validatorExports = v;
  }
};
var toDateExports = {};
var toDate = {
  get exports() {
    return toDateExports;
  },
  set exports(v) {
    toDateExports = v;
  }
};
var assertStringExports = {};
var assertString = {
  get exports() {
    return assertStringExports;
  },
  set exports(v) {
    assertStringExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = assertString2;
  function _typeof2(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof2 = function _typeof3(obj2) {
        return typeof obj2;
      };
    } else {
      _typeof2 = function _typeof3(obj2) {
        return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
      };
    }
    return _typeof2(obj);
  }
  function assertString2(input) {
    var isString2 = typeof input === "string" || input instanceof String;
    if (!isString2) {
      var invalidType = _typeof2(input);
      if (input === null)
        invalidType = "null";
      else if (invalidType === "object")
        invalidType = input.constructor.name;
      throw new TypeError("Expected a string but received a ".concat(invalidType));
    }
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(assertString, assertStringExports);
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = toDate2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function toDate2(date) {
    (0, _assertString2.default)(date);
    date = Date.parse(date);
    return !isNaN(date) ? new Date(date) : null;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(toDate, toDateExports);
var toFloatExports = {};
var toFloat = {
  get exports() {
    return toFloatExports;
  },
  set exports(v) {
    toFloatExports = v;
  }
};
var isFloat$1 = {};
var alpha$1 = {};
Object.defineProperty(alpha$1, "__esModule", {
  value: true
});
alpha$1.commaDecimal = alpha$1.dotDecimal = alpha$1.bengaliLocales = alpha$1.farsiLocales = alpha$1.arabicLocales = alpha$1.englishLocales = alpha$1.decimal = alpha$1.alphanumeric = alpha$1.alpha = void 0;
var alpha = {
  "en-US": /^[A-Z]+$/i,
  "az-AZ": /^[A-VXYZÇƏĞİıÖŞÜ]+$/i,
  "bg-BG": /^[А-Я]+$/i,
  "cs-CZ": /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
  "da-DK": /^[A-ZÆØÅ]+$/i,
  "de-DE": /^[A-ZÄÖÜß]+$/i,
  "el-GR": /^[Α-ώ]+$/i,
  "es-ES": /^[A-ZÁÉÍÑÓÚÜ]+$/i,
  "fa-IR": /^[ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]+$/i,
  "fi-FI": /^[A-ZÅÄÖ]+$/i,
  "fr-FR": /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
  "it-IT": /^[A-ZÀÉÈÌÎÓÒÙ]+$/i,
  "ja-JP": /^[ぁ-んァ-ヶｦ-ﾟ一-龠ー・。、]+$/i,
  "nb-NO": /^[A-ZÆØÅ]+$/i,
  "nl-NL": /^[A-ZÁÉËÏÓÖÜÚ]+$/i,
  "nn-NO": /^[A-ZÆØÅ]+$/i,
  "hu-HU": /^[A-ZÁÉÍÓÖŐÚÜŰ]+$/i,
  "pl-PL": /^[A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
  "pt-PT": /^[A-ZÃÁÀÂÄÇÉÊËÍÏÕÓÔÖÚÜ]+$/i,
  "ru-RU": /^[А-ЯЁ]+$/i,
  "sl-SI": /^[A-ZČĆĐŠŽ]+$/i,
  "sk-SK": /^[A-ZÁČĎÉÍŇÓŠŤÚÝŽĹŔĽÄÔ]+$/i,
  "sr-RS@latin": /^[A-ZČĆŽŠĐ]+$/i,
  "sr-RS": /^[А-ЯЂЈЉЊЋЏ]+$/i,
  "sv-SE": /^[A-ZÅÄÖ]+$/i,
  "th-TH": /^[ก-๐\s]+$/i,
  "tr-TR": /^[A-ZÇĞİıÖŞÜ]+$/i,
  "uk-UA": /^[А-ЩЬЮЯЄIЇҐі]+$/i,
  "vi-VN": /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴĐÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ]+$/i,
  "ko-KR": /^[ㄱ-ㅎㅏ-ㅣ가-힣]*$/,
  "ku-IQ": /^[ئابپتجچحخدرڕزژسشعغفڤقکگلڵمنوۆھەیێيطؤثآإأكضصةظذ]+$/i,
  ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/,
  he: /^[א-ת]+$/,
  fa: /^['آاءأؤئبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهةی']+$/i,
  bn: /^['ঀঁংঃঅআইঈউঊঋঌএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ়ঽািীুূৃৄেৈোৌ্ৎৗড়ঢ়য়ৠৡৢৣৰৱ৲৳৴৵৶৷৸৹৺৻']+$/,
  "hi-IN": /^[\u0900-\u0961]+[\u0972-\u097F]*$/i,
  "si-LK": /^[\u0D80-\u0DFF]+$/
};
alpha$1.alpha = alpha;
var alphanumeric = {
  "en-US": /^[0-9A-Z]+$/i,
  "az-AZ": /^[0-9A-VXYZÇƏĞİıÖŞÜ]+$/i,
  "bg-BG": /^[0-9А-Я]+$/i,
  "cs-CZ": /^[0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
  "da-DK": /^[0-9A-ZÆØÅ]+$/i,
  "de-DE": /^[0-9A-ZÄÖÜß]+$/i,
  "el-GR": /^[0-9Α-ω]+$/i,
  "es-ES": /^[0-9A-ZÁÉÍÑÓÚÜ]+$/i,
  "fi-FI": /^[0-9A-ZÅÄÖ]+$/i,
  "fr-FR": /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
  "it-IT": /^[0-9A-ZÀÉÈÌÎÓÒÙ]+$/i,
  "ja-JP": /^[0-9０-９ぁ-んァ-ヶｦ-ﾟ一-龠ー・。、]+$/i,
  "hu-HU": /^[0-9A-ZÁÉÍÓÖŐÚÜŰ]+$/i,
  "nb-NO": /^[0-9A-ZÆØÅ]+$/i,
  "nl-NL": /^[0-9A-ZÁÉËÏÓÖÜÚ]+$/i,
  "nn-NO": /^[0-9A-ZÆØÅ]+$/i,
  "pl-PL": /^[0-9A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
  "pt-PT": /^[0-9A-ZÃÁÀÂÄÇÉÊËÍÏÕÓÔÖÚÜ]+$/i,
  "ru-RU": /^[0-9А-ЯЁ]+$/i,
  "sl-SI": /^[0-9A-ZČĆĐŠŽ]+$/i,
  "sk-SK": /^[0-9A-ZÁČĎÉÍŇÓŠŤÚÝŽĹŔĽÄÔ]+$/i,
  "sr-RS@latin": /^[0-9A-ZČĆŽŠĐ]+$/i,
  "sr-RS": /^[0-9А-ЯЂЈЉЊЋЏ]+$/i,
  "sv-SE": /^[0-9A-ZÅÄÖ]+$/i,
  "th-TH": /^[ก-๙\s]+$/i,
  "tr-TR": /^[0-9A-ZÇĞİıÖŞÜ]+$/i,
  "uk-UA": /^[0-9А-ЩЬЮЯЄIЇҐі]+$/i,
  "ko-KR": /^[0-9ㄱ-ㅎㅏ-ㅣ가-힣]*$/,
  "ku-IQ": /^[٠١٢٣٤٥٦٧٨٩0-9ئابپتجچحخدرڕزژسشعغفڤقکگلڵمنوۆھەیێيطؤثآإأكضصةظذ]+$/i,
  "vi-VN": /^[0-9A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴĐÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ]+$/i,
  ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/,
  he: /^[0-9א-ת]+$/,
  fa: /^['0-9آاءأؤئبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهةی۱۲۳۴۵۶۷۸۹۰']+$/i,
  bn: /^['ঀঁংঃঅআইঈউঊঋঌএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ়ঽািীুূৃৄেৈোৌ্ৎৗড়ঢ়য়ৠৡৢৣ০১২৩৪৫৬৭৮৯ৰৱ৲৳৴৵৶৷৸৹৺৻']+$/,
  "hi-IN": /^[\u0900-\u0963]+[\u0966-\u097F]*$/i,
  "si-LK": /^[0-9\u0D80-\u0DFF]+$/
};
alpha$1.alphanumeric = alphanumeric;
var decimal = {
  "en-US": ".",
  ar: "٫"
};
alpha$1.decimal = decimal;
var englishLocales = ["AU", "GB", "HK", "IN", "NZ", "ZA", "ZM"];
alpha$1.englishLocales = englishLocales;
for (var locale, i = 0; i < englishLocales.length; i++) {
  locale = "en-".concat(englishLocales[i]);
  alpha[locale] = alpha["en-US"];
  alphanumeric[locale] = alphanumeric["en-US"];
  decimal[locale] = decimal["en-US"];
}
var arabicLocales = ["AE", "BH", "DZ", "EG", "IQ", "JO", "KW", "LB", "LY", "MA", "QM", "QA", "SA", "SD", "SY", "TN", "YE"];
alpha$1.arabicLocales = arabicLocales;
for (var _locale, _i = 0; _i < arabicLocales.length; _i++) {
  _locale = "ar-".concat(arabicLocales[_i]);
  alpha[_locale] = alpha.ar;
  alphanumeric[_locale] = alphanumeric.ar;
  decimal[_locale] = decimal.ar;
}
var farsiLocales = ["IR", "AF"];
alpha$1.farsiLocales = farsiLocales;
for (var _locale2, _i2 = 0; _i2 < farsiLocales.length; _i2++) {
  _locale2 = "fa-".concat(farsiLocales[_i2]);
  alphanumeric[_locale2] = alphanumeric.fa;
  decimal[_locale2] = decimal.ar;
}
var bengaliLocales = ["BD", "IN"];
alpha$1.bengaliLocales = bengaliLocales;
for (var _locale3, _i3 = 0; _i3 < bengaliLocales.length; _i3++) {
  _locale3 = "bn-".concat(bengaliLocales[_i3]);
  alpha[_locale3] = alpha.bn;
  alphanumeric[_locale3] = alphanumeric.bn;
  decimal[_locale3] = decimal["en-US"];
}
var dotDecimal = ["ar-EG", "ar-LB", "ar-LY"];
alpha$1.dotDecimal = dotDecimal;
var commaDecimal = ["bg-BG", "cs-CZ", "da-DK", "de-DE", "el-GR", "en-ZM", "es-ES", "fr-CA", "fr-FR", "id-ID", "it-IT", "ku-IQ", "hi-IN", "hu-HU", "nb-NO", "nn-NO", "nl-NL", "pl-PL", "pt-PT", "ru-RU", "si-LK", "sl-SI", "sr-RS@latin", "sr-RS", "sv-SE", "tr-TR", "uk-UA", "vi-VN"];
alpha$1.commaDecimal = commaDecimal;
for (var _i4 = 0; _i4 < dotDecimal.length; _i4++) {
  decimal[dotDecimal[_i4]] = decimal["en-US"];
}
for (var _i5 = 0; _i5 < commaDecimal.length; _i5++) {
  decimal[commaDecimal[_i5]] = ",";
}
alpha["fr-CA"] = alpha["fr-FR"];
alphanumeric["fr-CA"] = alphanumeric["fr-FR"];
alpha["pt-BR"] = alpha["pt-PT"];
alphanumeric["pt-BR"] = alphanumeric["pt-PT"];
decimal["pt-BR"] = decimal["pt-PT"];
alpha["pl-Pl"] = alpha["pl-PL"];
alphanumeric["pl-Pl"] = alphanumeric["pl-PL"];
decimal["pl-Pl"] = decimal["pl-PL"];
alpha["fa-AF"] = alpha.fa;
Object.defineProperty(isFloat$1, "__esModule", {
  value: true
});
isFloat$1.default = isFloat;
isFloat$1.locales = void 0;
var _assertString$a = _interopRequireDefault$a(assertStringExports);
var _alpha$2 = alpha$1;
function _interopRequireDefault$a(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function isFloat(str, options) {
  (0, _assertString$a.default)(str);
  options = options || {};
  var float = new RegExp("^(?:[-+])?(?:[0-9]+)?(?:\\".concat(options.locale ? _alpha$2.decimal[options.locale] : ".", "[0-9]*)?(?:[eE][\\+\\-]?(?:[0-9]+))?$"));
  if (str === "" || str === "." || str === "," || str === "-" || str === "+") {
    return false;
  }
  var value = parseFloat(str.replace(",", "."));
  return float.test(str) && (!options.hasOwnProperty("min") || value >= options.min) && (!options.hasOwnProperty("max") || value <= options.max) && (!options.hasOwnProperty("lt") || value < options.lt) && (!options.hasOwnProperty("gt") || value > options.gt);
}
var locales$5 = Object.keys(_alpha$2.decimal);
isFloat$1.locales = locales$5;
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = toFloat2;
  var _isFloat = _interopRequireDefault2(isFloat$1);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function toFloat2(str) {
    if (!(0, _isFloat.default)(str))
      return NaN;
    return parseFloat(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(toFloat, toFloatExports);
var toIntExports = {};
var toInt = {
  get exports() {
    return toIntExports;
  },
  set exports(v) {
    toIntExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = toInt2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function toInt2(str, radix) {
    (0, _assertString2.default)(str);
    return parseInt(str, radix || 10);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(toInt, toIntExports);
var toBooleanExports = {};
var toBoolean = {
  get exports() {
    return toBooleanExports;
  },
  set exports(v) {
    toBooleanExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = toBoolean2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function toBoolean2(str, strict) {
    (0, _assertString2.default)(str);
    if (strict) {
      return str === "1" || /^true$/i.test(str);
    }
    return str !== "0" && !/^false$/i.test(str) && str !== "";
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(toBoolean, toBooleanExports);
var equalsExports = {};
var equals = {
  get exports() {
    return equalsExports;
  },
  set exports(v) {
    equalsExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = equals2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function equals2(str, comparison) {
    (0, _assertString2.default)(str);
    return str === comparison;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(equals, equalsExports);
var containsExports = {};
var contains = {
  get exports() {
    return containsExports;
  },
  set exports(v) {
    containsExports = v;
  }
};
var toStringExports = {};
var toString$1 = {
  get exports() {
    return toStringExports;
  },
  set exports(v) {
    toStringExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = toString2;
  function _typeof2(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof2 = function _typeof3(obj2) {
        return typeof obj2;
      };
    } else {
      _typeof2 = function _typeof3(obj2) {
        return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
      };
    }
    return _typeof2(obj);
  }
  function toString2(input) {
    if (_typeof2(input) === "object" && input !== null) {
      if (typeof input.toString === "function") {
        input = input.toString();
      } else {
        input = "[object Object]";
      }
    } else if (input === null || typeof input === "undefined" || isNaN(input) && !input.length) {
      input = "";
    }
    return String(input);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(toString$1, toStringExports);
var mergeExports = {};
var merge = {
  get exports() {
    return mergeExports;
  },
  set exports(v) {
    mergeExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = merge2;
  function merge2() {
    var obj = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var defaults = arguments.length > 1 ? arguments[1] : void 0;
    for (var key in defaults) {
      if (typeof obj[key] === "undefined") {
        obj[key] = defaults[key];
      }
    }
    return obj;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(merge, mergeExports);
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = contains2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var _toString = _interopRequireDefault2(toStringExports);
  var _merge = _interopRequireDefault2(mergeExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var defaulContainsOptions = {
    ignoreCase: false,
    minOccurrences: 1
  };
  function contains2(str, elem, options) {
    (0, _assertString2.default)(str);
    options = (0, _merge.default)(options, defaulContainsOptions);
    if (options.ignoreCase) {
      return str.toLowerCase().split((0, _toString.default)(elem).toLowerCase()).length > options.minOccurrences;
    }
    return str.split((0, _toString.default)(elem)).length > options.minOccurrences;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(contains, containsExports);
var matchesExports = {};
var matches = {
  get exports() {
    return matchesExports;
  },
  set exports(v) {
    matchesExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = matches2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function matches2(str, pattern, modifiers) {
    (0, _assertString2.default)(str);
    if (Object.prototype.toString.call(pattern) !== "[object RegExp]") {
      pattern = new RegExp(pattern, modifiers);
    }
    return !!str.match(pattern);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(matches, matchesExports);
var isEmailExports = {};
var isEmail = {
  get exports() {
    return isEmailExports;
  },
  set exports(v) {
    isEmailExports = v;
  }
};
var isByteLengthExports = {};
var isByteLength = {
  get exports() {
    return isByteLengthExports;
  },
  set exports(v) {
    isByteLengthExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isByteLength2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function _typeof2(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof2 = function _typeof3(obj2) {
        return typeof obj2;
      };
    } else {
      _typeof2 = function _typeof3(obj2) {
        return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
      };
    }
    return _typeof2(obj);
  }
  function isByteLength2(str, options) {
    (0, _assertString2.default)(str);
    var min;
    var max;
    if (_typeof2(options) === "object") {
      min = options.min || 0;
      max = options.max;
    } else {
      min = arguments[1];
      max = arguments[2];
    }
    var len = encodeURI(str).split(/%..|./).length - 1;
    return len >= min && (typeof max === "undefined" || len <= max);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isByteLength, isByteLengthExports);
var isFQDNExports = {};
var isFQDN = {
  get exports() {
    return isFQDNExports;
  },
  set exports(v) {
    isFQDNExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isFQDN2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var _merge = _interopRequireDefault2(mergeExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var default_fqdn_options = {
    require_tld: true,
    allow_underscores: false,
    allow_trailing_dot: false,
    allow_numeric_tld: false,
    allow_wildcard: false,
    ignore_max_length: false
  };
  function isFQDN2(str, options) {
    (0, _assertString2.default)(str);
    options = (0, _merge.default)(options, default_fqdn_options);
    if (options.allow_trailing_dot && str[str.length - 1] === ".") {
      str = str.substring(0, str.length - 1);
    }
    if (options.allow_wildcard === true && str.indexOf("*.") === 0) {
      str = str.substring(2);
    }
    var parts = str.split(".");
    var tld = parts[parts.length - 1];
    if (options.require_tld) {
      if (parts.length < 2) {
        return false;
      }
      if (!options.allow_numeric_tld && !/^([a-z\u00A1-\u00A8\u00AA-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
        return false;
      }
      if (/\s/.test(tld)) {
        return false;
      }
    }
    if (!options.allow_numeric_tld && /^\d+$/.test(tld)) {
      return false;
    }
    return parts.every(function(part) {
      if (part.length > 63 && !options.ignore_max_length) {
        return false;
      }
      if (!/^[a-z_\u00a1-\uffff0-9-]+$/i.test(part)) {
        return false;
      }
      if (/[\uff01-\uff5e]/.test(part)) {
        return false;
      }
      if (/^-|-$/.test(part)) {
        return false;
      }
      if (!options.allow_underscores && /_/.test(part)) {
        return false;
      }
      return true;
    });
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isFQDN, isFQDNExports);
var isIPExports = {};
var isIP = {
  get exports() {
    return isIPExports;
  },
  set exports(v) {
    isIPExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isIP2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var IPv4SegmentFormat = "(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])";
  var IPv4AddressFormat = "(".concat(IPv4SegmentFormat, "[.]){3}").concat(IPv4SegmentFormat);
  var IPv4AddressRegExp = new RegExp("^".concat(IPv4AddressFormat, "$"));
  var IPv6SegmentFormat = "(?:[0-9a-fA-F]{1,4})";
  var IPv6AddressRegExp = new RegExp("^(" + "(?:".concat(IPv6SegmentFormat, ":){7}(?:").concat(IPv6SegmentFormat, "|:)|") + "(?:".concat(IPv6SegmentFormat, ":){6}(?:").concat(IPv4AddressFormat, "|:").concat(IPv6SegmentFormat, "|:)|") + "(?:".concat(IPv6SegmentFormat, ":){5}(?::").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,2}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){4}(?:(:").concat(IPv6SegmentFormat, "){0,1}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,3}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){3}(?:(:").concat(IPv6SegmentFormat, "){0,2}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,4}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){2}(?:(:").concat(IPv6SegmentFormat, "){0,3}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,5}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){1}(?:(:").concat(IPv6SegmentFormat, "){0,4}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,6}|:)|") + "(?::((?::".concat(IPv6SegmentFormat, "){0,5}:").concat(IPv4AddressFormat, "|(?::").concat(IPv6SegmentFormat, "){1,7}|:))") + ")(%[0-9a-zA-Z-.:]{1,})?$");
  function isIP2(str) {
    var version2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    (0, _assertString2.default)(str);
    version2 = String(version2);
    if (!version2) {
      return isIP2(str, 4) || isIP2(str, 6);
    }
    if (version2 === "4") {
      return IPv4AddressRegExp.test(str);
    }
    if (version2 === "6") {
      return IPv6AddressRegExp.test(str);
    }
    return false;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isIP, isIPExports);
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isEmail2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var _merge = _interopRequireDefault2(mergeExports);
  var _isByteLength = _interopRequireDefault2(isByteLengthExports);
  var _isFQDN = _interopRequireDefault2(isFQDNExports);
  var _isIP = _interopRequireDefault2(isIPExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var default_email_options = {
    allow_display_name: false,
    require_display_name: false,
    allow_utf8_local_part: true,
    require_tld: true,
    blacklisted_chars: "",
    ignore_max_length: false,
    host_blacklist: [],
    host_whitelist: []
  };
  var splitNameAddress = /^([^\x00-\x1F\x7F-\x9F\cX]+)</i;
  var emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
  var gmailUserPart = /^[a-z\d]+$/;
  var quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
  var emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
  var quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;
  var defaultMaxEmailLength = 254;
  function validateDisplayName(display_name) {
    var display_name_without_quotes = display_name.replace(/^"(.+)"$/, "$1");
    if (!display_name_without_quotes.trim()) {
      return false;
    }
    var contains_illegal = /[\.";<>]/.test(display_name_without_quotes);
    if (contains_illegal) {
      if (display_name_without_quotes === display_name) {
        return false;
      }
      var all_start_with_back_slash = display_name_without_quotes.split('"').length === display_name_without_quotes.split('\\"').length;
      if (!all_start_with_back_slash) {
        return false;
      }
    }
    return true;
  }
  function isEmail2(str, options) {
    (0, _assertString2.default)(str);
    options = (0, _merge.default)(options, default_email_options);
    if (options.require_display_name || options.allow_display_name) {
      var display_email = str.match(splitNameAddress);
      if (display_email) {
        var display_name = display_email[1];
        str = str.replace(display_name, "").replace(/(^<|>$)/g, "");
        if (display_name.endsWith(" ")) {
          display_name = display_name.slice(0, -1);
        }
        if (!validateDisplayName(display_name)) {
          return false;
        }
      } else if (options.require_display_name) {
        return false;
      }
    }
    if (!options.ignore_max_length && str.length > defaultMaxEmailLength) {
      return false;
    }
    var parts = str.split("@");
    var domain = parts.pop();
    var lower_domain = domain.toLowerCase();
    if (options.host_blacklist.includes(lower_domain)) {
      return false;
    }
    if (options.host_whitelist.length > 0 && !options.host_whitelist.includes(lower_domain)) {
      return false;
    }
    var user = parts.join("@");
    if (options.domain_specific_validation && (lower_domain === "gmail.com" || lower_domain === "googlemail.com")) {
      user = user.toLowerCase();
      var username = user.split("+")[0];
      if (!(0, _isByteLength.default)(username.replace(/\./g, ""), {
        min: 6,
        max: 30
      })) {
        return false;
      }
      var _user_parts = username.split(".");
      for (var i = 0; i < _user_parts.length; i++) {
        if (!gmailUserPart.test(_user_parts[i])) {
          return false;
        }
      }
    }
    if (options.ignore_max_length === false && (!(0, _isByteLength.default)(user, {
      max: 64
    }) || !(0, _isByteLength.default)(domain, {
      max: 254
    }))) {
      return false;
    }
    if (!(0, _isFQDN.default)(domain, {
      require_tld: options.require_tld,
      ignore_max_length: options.ignore_max_length
    })) {
      if (!options.allow_ip_domain) {
        return false;
      }
      if (!(0, _isIP.default)(domain)) {
        if (!domain.startsWith("[") || !domain.endsWith("]")) {
          return false;
        }
        var noBracketdomain = domain.slice(1, -1);
        if (noBracketdomain.length === 0 || !(0, _isIP.default)(noBracketdomain)) {
          return false;
        }
      }
    }
    if (user[0] === '"') {
      user = user.slice(1, user.length - 1);
      return options.allow_utf8_local_part ? quotedEmailUserUtf8.test(user) : quotedEmailUser.test(user);
    }
    var pattern = options.allow_utf8_local_part ? emailUserUtf8Part : emailUserPart;
    var user_parts = user.split(".");
    for (var _i = 0; _i < user_parts.length; _i++) {
      if (!pattern.test(user_parts[_i])) {
        return false;
      }
    }
    if (options.blacklisted_chars) {
      if (user.search(new RegExp("[".concat(options.blacklisted_chars, "]+"), "g")) !== -1)
        return false;
    }
    return true;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isEmail, isEmailExports);
var isURLExports = {};
var isURL = {
  get exports() {
    return isURLExports;
  },
  set exports(v) {
    isURLExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isURL2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var _isFQDN = _interopRequireDefault2(isFQDNExports);
  var _isIP = _interopRequireDefault2(isIPExports);
  var _merge = _interopRequireDefault2(mergeExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
      return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = void 0;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i)
          break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null)
          _i["return"]();
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  var default_url_options = {
    protocols: ["http", "https", "ftp"],
    require_tld: true,
    require_protocol: false,
    require_host: true,
    require_port: false,
    require_valid_protocol: true,
    allow_underscores: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false,
    allow_fragments: true,
    allow_query_components: true,
    validate_length: true
  };
  var wrapped_ipv6 = /^\[([^\]]+)\](?::([0-9]+))?$/;
  function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === "[object RegExp]";
  }
  function checkHost(host, matches2) {
    for (var i = 0; i < matches2.length; i++) {
      var match = matches2[i];
      if (host === match || isRegExp(match) && match.test(host)) {
        return true;
      }
    }
    return false;
  }
  function isURL2(url, options) {
    (0, _assertString2.default)(url);
    if (!url || /[\s<>]/.test(url)) {
      return false;
    }
    if (url.indexOf("mailto:") === 0) {
      return false;
    }
    options = (0, _merge.default)(options, default_url_options);
    if (options.validate_length && url.length >= 2083) {
      return false;
    }
    if (!options.allow_fragments && url.includes("#")) {
      return false;
    }
    if (!options.allow_query_components && (url.includes("?") || url.includes("&"))) {
      return false;
    }
    var protocol, auth, host, hostname, port, port_str, split, ipv6;
    split = url.split("#");
    url = split.shift();
    split = url.split("?");
    url = split.shift();
    split = url.split("://");
    if (split.length > 1) {
      protocol = split.shift().toLowerCase();
      if (options.require_valid_protocol && options.protocols.indexOf(protocol) === -1) {
        return false;
      }
    } else if (options.require_protocol) {
      return false;
    } else if (url.slice(0, 2) === "//") {
      if (!options.allow_protocol_relative_urls) {
        return false;
      }
      split[0] = url.slice(2);
    }
    url = split.join("://");
    if (url === "") {
      return false;
    }
    split = url.split("/");
    url = split.shift();
    if (url === "" && !options.require_host) {
      return true;
    }
    split = url.split("@");
    if (split.length > 1) {
      if (options.disallow_auth) {
        return false;
      }
      if (split[0] === "") {
        return false;
      }
      auth = split.shift();
      if (auth.indexOf(":") >= 0 && auth.split(":").length > 2) {
        return false;
      }
      var _auth$split = auth.split(":"), _auth$split2 = _slicedToArray(_auth$split, 2), user = _auth$split2[0], password = _auth$split2[1];
      if (user === "" && password === "") {
        return false;
      }
    }
    hostname = split.join("@");
    port_str = null;
    ipv6 = null;
    var ipv6_match = hostname.match(wrapped_ipv6);
    if (ipv6_match) {
      host = "";
      ipv6 = ipv6_match[1];
      port_str = ipv6_match[2] || null;
    } else {
      split = hostname.split(":");
      host = split.shift();
      if (split.length) {
        port_str = split.join(":");
      }
    }
    if (port_str !== null && port_str.length > 0) {
      port = parseInt(port_str, 10);
      if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
        return false;
      }
    } else if (options.require_port) {
      return false;
    }
    if (options.host_whitelist) {
      return checkHost(host, options.host_whitelist);
    }
    if (host === "" && !options.require_host) {
      return true;
    }
    if (!(0, _isIP.default)(host) && !(0, _isFQDN.default)(host, options) && (!ipv6 || !(0, _isIP.default)(ipv6, 6))) {
      return false;
    }
    host = host || ipv6;
    if (options.host_blacklist && checkHost(host, options.host_blacklist)) {
      return false;
    }
    return true;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isURL, isURLExports);
var isMACAddressExports = {};
var isMACAddress = {
  get exports() {
    return isMACAddressExports;
  },
  set exports(v) {
    isMACAddressExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isMACAddress2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var macAddress48 = /^(?:[0-9a-fA-F]{2}([-:\s]))([0-9a-fA-F]{2}\1){4}([0-9a-fA-F]{2})$/;
  var macAddress48NoSeparators = /^([0-9a-fA-F]){12}$/;
  var macAddress48WithDots = /^([0-9a-fA-F]{4}\.){2}([0-9a-fA-F]{4})$/;
  var macAddress64 = /^(?:[0-9a-fA-F]{2}([-:\s]))([0-9a-fA-F]{2}\1){6}([0-9a-fA-F]{2})$/;
  var macAddress64NoSeparators = /^([0-9a-fA-F]){16}$/;
  var macAddress64WithDots = /^([0-9a-fA-F]{4}\.){3}([0-9a-fA-F]{4})$/;
  function isMACAddress2(str, options) {
    (0, _assertString2.default)(str);
    if (options !== null && options !== void 0 && options.eui) {
      options.eui = String(options.eui);
    }
    if (options !== null && options !== void 0 && options.no_colons || options !== null && options !== void 0 && options.no_separators) {
      if (options.eui === "48") {
        return macAddress48NoSeparators.test(str);
      }
      if (options.eui === "64") {
        return macAddress64NoSeparators.test(str);
      }
      return macAddress48NoSeparators.test(str) || macAddress64NoSeparators.test(str);
    }
    if ((options === null || options === void 0 ? void 0 : options.eui) === "48") {
      return macAddress48.test(str) || macAddress48WithDots.test(str);
    }
    if ((options === null || options === void 0 ? void 0 : options.eui) === "64") {
      return macAddress64.test(str) || macAddress64WithDots.test(str);
    }
    return isMACAddress2(str, {
      eui: "48"
    }) || isMACAddress2(str, {
      eui: "64"
    });
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isMACAddress, isMACAddressExports);
var isIPRangeExports = {};
var isIPRange = {
  get exports() {
    return isIPRangeExports;
  },
  set exports(v) {
    isIPRangeExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isIPRange2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var _isIP = _interopRequireDefault2(isIPExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var subnetMaybe = /^\d{1,3}$/;
  var v4Subnet = 32;
  var v6Subnet = 128;
  function isIPRange2(str) {
    var version2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    (0, _assertString2.default)(str);
    var parts = str.split("/");
    if (parts.length !== 2) {
      return false;
    }
    if (!subnetMaybe.test(parts[1])) {
      return false;
    }
    if (parts[1].length > 1 && parts[1].startsWith("0")) {
      return false;
    }
    var isValidIP = (0, _isIP.default)(parts[0], version2);
    if (!isValidIP) {
      return false;
    }
    var expectedSubnet = null;
    switch (String(version2)) {
      case "4":
        expectedSubnet = v4Subnet;
        break;
      case "6":
        expectedSubnet = v6Subnet;
        break;
      default:
        expectedSubnet = (0, _isIP.default)(parts[0], "6") ? v6Subnet : v4Subnet;
    }
    return parts[1] <= expectedSubnet && parts[1] >= 0;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isIPRange, isIPRangeExports);
var isDateExports = {};
var isDate = {
  get exports() {
    return isDateExports;
  },
  set exports(v) {
    isDateExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isDate2;
  var _merge = _interopRequireDefault2(mergeExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
      return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = void 0;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i)
          break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null)
          _i["return"]();
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;
    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it)
          o = it;
        var i = 0;
        var F = function F2() {
        };
        return { s: F, n: function n() {
          if (i >= o.length)
            return { done: true };
          return { done: false, value: o[i++] };
        }, e: function e(_e2) {
          throw _e2;
        }, f: F };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return { s: function s() {
      it = o[Symbol.iterator]();
    }, n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    }, e: function e(_e3) {
      didErr = true;
      err = _e3;
    }, f: function f() {
      try {
        if (!normalCompletion && it.return != null)
          it.return();
      } finally {
        if (didErr)
          throw err;
      }
    } };
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
  var default_date_options = {
    format: "YYYY/MM/DD",
    delimiters: ["/", "-"],
    strictMode: false
  };
  function isValidFormat(format) {
    return /(^(y{4}|y{2})[.\/-](m{1,2})[.\/-](d{1,2})$)|(^(m{1,2})[.\/-](d{1,2})[.\/-]((y{4}|y{2})$))|(^(d{1,2})[.\/-](m{1,2})[.\/-]((y{4}|y{2})$))/gi.test(format);
  }
  function zip(date, format) {
    var zippedArr = [], len = Math.min(date.length, format.length);
    for (var i = 0; i < len; i++) {
      zippedArr.push([date[i], format[i]]);
    }
    return zippedArr;
  }
  function isDate2(input, options) {
    if (typeof options === "string") {
      options = (0, _merge.default)({
        format: options
      }, default_date_options);
    } else {
      options = (0, _merge.default)(options, default_date_options);
    }
    if (typeof input === "string" && isValidFormat(options.format)) {
      var formatDelimiter = options.delimiters.find(function(delimiter) {
        return options.format.indexOf(delimiter) !== -1;
      });
      var dateDelimiter = options.strictMode ? formatDelimiter : options.delimiters.find(function(delimiter) {
        return input.indexOf(delimiter) !== -1;
      });
      var dateAndFormat = zip(input.split(dateDelimiter), options.format.toLowerCase().split(formatDelimiter));
      var dateObj = {};
      var _iterator = _createForOfIteratorHelper(dateAndFormat), _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done; ) {
          var _step$value = _slicedToArray(_step.value, 2), dateWord = _step$value[0], formatWord = _step$value[1];
          if (dateWord.length !== formatWord.length) {
            return false;
          }
          dateObj[formatWord.charAt(0)] = dateWord;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return new Date("".concat(dateObj.m, "/").concat(dateObj.d, "/").concat(dateObj.y)).getDate() === +dateObj.d;
    }
    if (!options.strictMode) {
      return Object.prototype.toString.call(input) === "[object Date]" && isFinite(input);
    }
    return false;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isDate, isDateExports);
var isTimeExports = {};
var isTime = {
  get exports() {
    return isTimeExports;
  },
  set exports(v) {
    isTimeExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isTime2;
  var _merge = _interopRequireDefault2(mergeExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var default_time_options = {
    hourFormat: "hour24",
    mode: "default"
  };
  var formats = {
    hour24: {
      default: /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/,
      withSeconds: /^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/
    },
    hour12: {
      default: /^(0?[1-9]|1[0-2]):([0-5][0-9]) (A|P)M$/,
      withSeconds: /^(0?[1-9]|1[0-2]):([0-5][0-9]):([0-5][0-9]) (A|P)M$/
    }
  };
  function isTime2(input, options) {
    options = (0, _merge.default)(options, default_time_options);
    if (typeof input !== "string")
      return false;
    return formats[options.hourFormat][options.mode].test(input);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isTime, isTimeExports);
var isBooleanExports = {};
var isBoolean = {
  get exports() {
    return isBooleanExports;
  },
  set exports(v) {
    isBooleanExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isBoolean2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var defaultOptions = {
    loose: false
  };
  var strictBooleans = ["true", "false", "1", "0"];
  var looseBooleans = [].concat(strictBooleans, ["yes", "no"]);
  function isBoolean2(str) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : defaultOptions;
    (0, _assertString2.default)(str);
    if (options.loose) {
      return looseBooleans.includes(str.toLowerCase());
    }
    return strictBooleans.includes(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isBoolean, isBooleanExports);
var isLocaleExports = {};
var isLocale = {
  get exports() {
    return isLocaleExports;
  },
  set exports(v) {
    isLocaleExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isLocale2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var localeReg = /^[A-Za-z]{2,4}([_-]([A-Za-z]{4}|[\d]{3}))?([_-]([A-Za-z]{2}|[\d]{3}))?$/;
  function isLocale2(str) {
    (0, _assertString2.default)(str);
    if (str === "en_US_POSIX" || str === "ca_ES_VALENCIA") {
      return true;
    }
    return localeReg.test(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isLocale, isLocaleExports);
var isAlpha$1 = {};
Object.defineProperty(isAlpha$1, "__esModule", {
  value: true
});
isAlpha$1.default = isAlpha;
isAlpha$1.locales = void 0;
var _assertString$9 = _interopRequireDefault$9(assertStringExports);
var _alpha$1 = alpha$1;
function _interopRequireDefault$9(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function isAlpha(_str) {
  var locale = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "en-US";
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  (0, _assertString$9.default)(_str);
  var str = _str;
  var ignore = options.ignore;
  if (ignore) {
    if (ignore instanceof RegExp) {
      str = str.replace(ignore, "");
    } else if (typeof ignore === "string") {
      str = str.replace(new RegExp("[".concat(ignore.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, "\\$&"), "]"), "g"), "");
    } else {
      throw new Error("ignore should be instance of a String or RegExp");
    }
  }
  if (locale in _alpha$1.alpha) {
    return _alpha$1.alpha[locale].test(str);
  }
  throw new Error("Invalid locale '".concat(locale, "'"));
}
var locales$4 = Object.keys(_alpha$1.alpha);
isAlpha$1.locales = locales$4;
var isAlphanumeric$1 = {};
Object.defineProperty(isAlphanumeric$1, "__esModule", {
  value: true
});
isAlphanumeric$1.default = isAlphanumeric;
isAlphanumeric$1.locales = void 0;
var _assertString$8 = _interopRequireDefault$8(assertStringExports);
var _alpha = alpha$1;
function _interopRequireDefault$8(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function isAlphanumeric(_str) {
  var locale = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "en-US";
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  (0, _assertString$8.default)(_str);
  var str = _str;
  var ignore = options.ignore;
  if (ignore) {
    if (ignore instanceof RegExp) {
      str = str.replace(ignore, "");
    } else if (typeof ignore === "string") {
      str = str.replace(new RegExp("[".concat(ignore.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, "\\$&"), "]"), "g"), "");
    } else {
      throw new Error("ignore should be instance of a String or RegExp");
    }
  }
  if (locale in _alpha.alphanumeric) {
    return _alpha.alphanumeric[locale].test(str);
  }
  throw new Error("Invalid locale '".concat(locale, "'"));
}
var locales$3 = Object.keys(_alpha.alphanumeric);
isAlphanumeric$1.locales = locales$3;
var isNumericExports = {};
var isNumeric = {
  get exports() {
    return isNumericExports;
  },
  set exports(v) {
    isNumericExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isNumeric2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var _alpha2 = alpha$1;
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var numericNoSymbols = /^[0-9]+$/;
  function isNumeric2(str, options) {
    (0, _assertString2.default)(str);
    if (options && options.no_symbols) {
      return numericNoSymbols.test(str);
    }
    return new RegExp("^[+-]?([0-9]*[".concat((options || {}).locale ? _alpha2.decimal[options.locale] : ".", "])?[0-9]+$")).test(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isNumeric, isNumericExports);
var isPassportNumberExports = {};
var isPassportNumber = {
  get exports() {
    return isPassportNumberExports;
  },
  set exports(v) {
    isPassportNumberExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isPassportNumber2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var passportRegexByCountryCode = {
    AM: /^[A-Z]{2}\d{7}$/,
    // ARMENIA
    AR: /^[A-Z]{3}\d{6}$/,
    // ARGENTINA
    AT: /^[A-Z]\d{7}$/,
    // AUSTRIA
    AU: /^[A-Z]\d{7}$/,
    // AUSTRALIA
    AZ: /^[A-Z]{2,3}\d{7,8}$/,
    // AZERBAIJAN
    BE: /^[A-Z]{2}\d{6}$/,
    // BELGIUM
    BG: /^\d{9}$/,
    // BULGARIA
    BR: /^[A-Z]{2}\d{6}$/,
    // BRAZIL
    BY: /^[A-Z]{2}\d{7}$/,
    // BELARUS
    CA: /^[A-Z]{2}\d{6}$/,
    // CANADA
    CH: /^[A-Z]\d{7}$/,
    // SWITZERLAND
    CN: /^G\d{8}$|^E(?![IO])[A-Z0-9]\d{7}$/,
    // CHINA [G=Ordinary, E=Electronic] followed by 8-digits, or E followed by any UPPERCASE letter (except I and O) followed by 7 digits
    CY: /^[A-Z](\d{6}|\d{8})$/,
    // CYPRUS
    CZ: /^\d{8}$/,
    // CZECH REPUBLIC
    DE: /^[CFGHJKLMNPRTVWXYZ0-9]{9}$/,
    // GERMANY
    DK: /^\d{9}$/,
    // DENMARK
    DZ: /^\d{9}$/,
    // ALGERIA
    EE: /^([A-Z]\d{7}|[A-Z]{2}\d{7})$/,
    // ESTONIA (K followed by 7-digits), e-passports have 2 UPPERCASE followed by 7 digits
    ES: /^[A-Z0-9]{2}([A-Z0-9]?)\d{6}$/,
    // SPAIN
    FI: /^[A-Z]{2}\d{7}$/,
    // FINLAND
    FR: /^\d{2}[A-Z]{2}\d{5}$/,
    // FRANCE
    GB: /^\d{9}$/,
    // UNITED KINGDOM
    GR: /^[A-Z]{2}\d{7}$/,
    // GREECE
    HR: /^\d{9}$/,
    // CROATIA
    HU: /^[A-Z]{2}(\d{6}|\d{7})$/,
    // HUNGARY
    IE: /^[A-Z0-9]{2}\d{7}$/,
    // IRELAND
    IN: /^[A-Z]{1}-?\d{7}$/,
    // INDIA
    ID: /^[A-C]\d{7}$/,
    // INDONESIA
    IR: /^[A-Z]\d{8}$/,
    // IRAN
    IS: /^(A)\d{7}$/,
    // ICELAND
    IT: /^[A-Z0-9]{2}\d{7}$/,
    // ITALY
    JM: /^[Aa]\d{7}$/,
    // JAMAICA
    JP: /^[A-Z]{2}\d{7}$/,
    // JAPAN
    KR: /^[MS]\d{8}$/,
    // SOUTH KOREA, REPUBLIC OF KOREA, [S=PS Passports, M=PM Passports]
    KZ: /^[a-zA-Z]\d{7}$/,
    // KAZAKHSTAN
    LI: /^[a-zA-Z]\d{5}$/,
    // LIECHTENSTEIN
    LT: /^[A-Z0-9]{8}$/,
    // LITHUANIA
    LU: /^[A-Z0-9]{8}$/,
    // LUXEMBURG
    LV: /^[A-Z0-9]{2}\d{7}$/,
    // LATVIA
    LY: /^[A-Z0-9]{8}$/,
    // LIBYA
    MT: /^\d{7}$/,
    // MALTA
    MZ: /^([A-Z]{2}\d{7})|(\d{2}[A-Z]{2}\d{5})$/,
    // MOZAMBIQUE
    MY: /^[AHK]\d{8}$/,
    // MALAYSIA
    MX: /^\d{10,11}$/,
    // MEXICO
    NL: /^[A-Z]{2}[A-Z0-9]{6}\d$/,
    // NETHERLANDS
    NZ: /^([Ll]([Aa]|[Dd]|[Ff]|[Hh])|[Ee]([Aa]|[Pp])|[Nn])\d{6}$/,
    // NEW ZEALAND
    PH: /^([A-Z](\d{6}|\d{7}[A-Z]))|([A-Z]{2}(\d{6}|\d{7}))$/,
    // PHILIPPINES
    PK: /^[A-Z]{2}\d{7}$/,
    // PAKISTAN
    PL: /^[A-Z]{2}\d{7}$/,
    // POLAND
    PT: /^[A-Z]\d{6}$/,
    // PORTUGAL
    RO: /^\d{8,9}$/,
    // ROMANIA
    RU: /^\d{9}$/,
    // RUSSIAN FEDERATION
    SE: /^\d{8}$/,
    // SWEDEN
    SL: /^(P)[A-Z]\d{7}$/,
    // SLOVENIA
    SK: /^[0-9A-Z]\d{7}$/,
    // SLOVAKIA
    TH: /^[A-Z]{1,2}\d{6,7}$/,
    // THAILAND
    TR: /^[A-Z]\d{8}$/,
    // TURKEY
    UA: /^[A-Z]{2}\d{6}$/,
    // UKRAINE
    US: /^\d{9}$/
    // UNITED STATES
  };
  function isPassportNumber2(str, countryCode) {
    (0, _assertString2.default)(str);
    var normalizedStr = str.replace(/\s/g, "").toUpperCase();
    return countryCode.toUpperCase() in passportRegexByCountryCode && passportRegexByCountryCode[countryCode].test(normalizedStr);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isPassportNumber, isPassportNumberExports);
var isPortExports = {};
var isPort = {
  get exports() {
    return isPortExports;
  },
  set exports(v) {
    isPortExports = v;
  }
};
var isIntExports = {};
var isInt = {
  get exports() {
    return isIntExports;
  },
  set exports(v) {
    isIntExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isInt2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;
  var intLeadingZeroes = /^[-+]?[0-9]+$/;
  function isInt2(str, options) {
    (0, _assertString2.default)(str);
    options = options || {};
    var regex = options.hasOwnProperty("allow_leading_zeroes") && !options.allow_leading_zeroes ? int : intLeadingZeroes;
    var minCheckPassed = !options.hasOwnProperty("min") || str >= options.min;
    var maxCheckPassed = !options.hasOwnProperty("max") || str <= options.max;
    var ltCheckPassed = !options.hasOwnProperty("lt") || str < options.lt;
    var gtCheckPassed = !options.hasOwnProperty("gt") || str > options.gt;
    return regex.test(str) && minCheckPassed && maxCheckPassed && ltCheckPassed && gtCheckPassed;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isInt, isIntExports);
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isPort2;
  var _isInt = _interopRequireDefault2(isIntExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function isPort2(str) {
    return (0, _isInt.default)(str, {
      min: 0,
      max: 65535
    });
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isPort, isPortExports);
var isLowercaseExports = {};
var isLowercase = {
  get exports() {
    return isLowercaseExports;
  },
  set exports(v) {
    isLowercaseExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isLowercase2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function isLowercase2(str) {
    (0, _assertString2.default)(str);
    return str === str.toLowerCase();
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isLowercase, isLowercaseExports);
var isUppercaseExports = {};
var isUppercase = {
  get exports() {
    return isUppercaseExports;
  },
  set exports(v) {
    isUppercaseExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isUppercase2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function isUppercase2(str) {
    (0, _assertString2.default)(str);
    return str === str.toUpperCase();
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isUppercase, isUppercaseExports);
var isIMEIExports = {};
var isIMEI = {
  get exports() {
    return isIMEIExports;
  },
  set exports(v) {
    isIMEIExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isIMEI2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var imeiRegexWithoutHypens = /^[0-9]{15}$/;
  var imeiRegexWithHypens = /^\d{2}-\d{6}-\d{6}-\d{1}$/;
  function isIMEI2(str, options) {
    (0, _assertString2.default)(str);
    options = options || {};
    var imeiRegex = imeiRegexWithoutHypens;
    if (options.allow_hyphens) {
      imeiRegex = imeiRegexWithHypens;
    }
    if (!imeiRegex.test(str)) {
      return false;
    }
    str = str.replace(/-/g, "");
    var sum = 0, mul = 2, l = 14;
    for (var i = 0; i < l; i++) {
      var digit = str.substring(l - i - 1, l - i);
      var tp = parseInt(digit, 10) * mul;
      if (tp >= 10) {
        sum += tp % 10 + 1;
      } else {
        sum += tp;
      }
      if (mul === 1) {
        mul += 1;
      } else {
        mul -= 1;
      }
    }
    var chk = (10 - sum % 10) % 10;
    if (chk !== parseInt(str.substring(14, 15), 10)) {
      return false;
    }
    return true;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isIMEI, isIMEIExports);
var isAsciiExports = {};
var isAscii = {
  get exports() {
    return isAsciiExports;
  },
  set exports(v) {
    isAsciiExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isAscii2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var ascii = /^[\x00-\x7F]+$/;
  function isAscii2(str) {
    (0, _assertString2.default)(str);
    return ascii.test(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isAscii, isAsciiExports);
var isFullWidth$1 = {};
Object.defineProperty(isFullWidth$1, "__esModule", {
  value: true
});
isFullWidth$1.default = isFullWidth;
isFullWidth$1.fullWidth = void 0;
var _assertString$7 = _interopRequireDefault$7(assertStringExports);
function _interopRequireDefault$7(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
var fullWidth = /[^\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/;
isFullWidth$1.fullWidth = fullWidth;
function isFullWidth(str) {
  (0, _assertString$7.default)(str);
  return fullWidth.test(str);
}
var isHalfWidth$1 = {};
Object.defineProperty(isHalfWidth$1, "__esModule", {
  value: true
});
isHalfWidth$1.default = isHalfWidth;
isHalfWidth$1.halfWidth = void 0;
var _assertString$6 = _interopRequireDefault$6(assertStringExports);
function _interopRequireDefault$6(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
var halfWidth = /[\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/;
isHalfWidth$1.halfWidth = halfWidth;
function isHalfWidth(str) {
  (0, _assertString$6.default)(str);
  return halfWidth.test(str);
}
var isVariableWidthExports = {};
var isVariableWidth = {
  get exports() {
    return isVariableWidthExports;
  },
  set exports(v) {
    isVariableWidthExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isVariableWidth2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var _isFullWidth = isFullWidth$1;
  var _isHalfWidth = isHalfWidth$1;
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function isVariableWidth2(str) {
    (0, _assertString2.default)(str);
    return _isFullWidth.fullWidth.test(str) && _isHalfWidth.halfWidth.test(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isVariableWidth, isVariableWidthExports);
var isMultibyteExports = {};
var isMultibyte = {
  get exports() {
    return isMultibyteExports;
  },
  set exports(v) {
    isMultibyteExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isMultibyte2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var multibyte = /[^\x00-\x7F]/;
  function isMultibyte2(str) {
    (0, _assertString2.default)(str);
    return multibyte.test(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isMultibyte, isMultibyteExports);
var isSemVerExports = {};
var isSemVer = {
  get exports() {
    return isSemVerExports;
  },
  set exports(v) {
    isSemVerExports = v;
  }
};
var multilineRegexExports = {};
var multilineRegex = {
  get exports() {
    return multilineRegexExports;
  },
  set exports(v) {
    multilineRegexExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = multilineRegexp;
  function multilineRegexp(parts, flags) {
    var regexpAsStringLiteral = parts.join("");
    return new RegExp(regexpAsStringLiteral, flags);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(multilineRegex, multilineRegexExports);
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isSemVer2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var _multilineRegex = _interopRequireDefault2(multilineRegexExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var semanticVersioningRegex = (0, _multilineRegex.default)(["^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)", "(?:-((?:0|[1-9]\\d*|\\d*[a-z-][0-9a-z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-z-][0-9a-z-]*))*))", "?(?:\\+([0-9a-z-]+(?:\\.[0-9a-z-]+)*))?$"], "i");
  function isSemVer2(str) {
    (0, _assertString2.default)(str);
    return semanticVersioningRegex.test(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isSemVer, isSemVerExports);
var isSurrogatePairExports = {};
var isSurrogatePair = {
  get exports() {
    return isSurrogatePairExports;
  },
  set exports(v) {
    isSurrogatePairExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isSurrogatePair2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var surrogatePair = /[\uD800-\uDBFF][\uDC00-\uDFFF]/;
  function isSurrogatePair2(str) {
    (0, _assertString2.default)(str);
    return surrogatePair.test(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isSurrogatePair, isSurrogatePairExports);
var isDecimalExports = {};
var isDecimal = {
  get exports() {
    return isDecimalExports;
  },
  set exports(v) {
    isDecimalExports = v;
  }
};
var includesExports = {};
var includes = {
  get exports() {
    return includesExports;
  },
  set exports(v) {
    includesExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var includes2 = function includes3(arr, val) {
    return arr.some(function(arrVal) {
      return val === arrVal;
    });
  };
  var _default = includes2;
  exports.default = _default;
  module.exports = exports.default;
  module.exports.default = exports.default;
})(includes, includesExports);
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isDecimal2;
  var _merge = _interopRequireDefault2(mergeExports);
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var _includes = _interopRequireDefault2(includesExports);
  var _alpha2 = alpha$1;
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function decimalRegExp(options) {
    var regExp = new RegExp("^[-+]?([0-9]+)?(\\".concat(_alpha2.decimal[options.locale], "[0-9]{").concat(options.decimal_digits, "})").concat(options.force_decimal ? "" : "?", "$"));
    return regExp;
  }
  var default_decimal_options = {
    force_decimal: false,
    decimal_digits: "1,",
    locale: "en-US"
  };
  var blacklist2 = ["", "-", "+"];
  function isDecimal2(str, options) {
    (0, _assertString2.default)(str);
    options = (0, _merge.default)(options, default_decimal_options);
    if (options.locale in _alpha2.decimal) {
      return !(0, _includes.default)(blacklist2, str.replace(/ /g, "")) && decimalRegExp(options).test(str);
    }
    throw new Error("Invalid locale '".concat(options.locale, "'"));
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isDecimal, isDecimalExports);
var isHexadecimalExports = {};
var isHexadecimal = {
  get exports() {
    return isHexadecimalExports;
  },
  set exports(v) {
    isHexadecimalExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isHexadecimal2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var hexadecimal = /^(0x|0h)?[0-9A-F]+$/i;
  function isHexadecimal2(str) {
    (0, _assertString2.default)(str);
    return hexadecimal.test(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isHexadecimal, isHexadecimalExports);
var isOctalExports = {};
var isOctal = {
  get exports() {
    return isOctalExports;
  },
  set exports(v) {
    isOctalExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isOctal2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var octal = /^(0o)?[0-7]+$/i;
  function isOctal2(str) {
    (0, _assertString2.default)(str);
    return octal.test(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isOctal, isOctalExports);
var isDivisibleByExports = {};
var isDivisibleBy = {
  get exports() {
    return isDivisibleByExports;
  },
  set exports(v) {
    isDivisibleByExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isDivisibleBy2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var _toFloat = _interopRequireDefault2(toFloatExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function isDivisibleBy2(str, num) {
    (0, _assertString2.default)(str);
    return (0, _toFloat.default)(str) % parseInt(num, 10) === 0;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isDivisibleBy, isDivisibleByExports);
var isHexColorExports = {};
var isHexColor = {
  get exports() {
    return isHexColorExports;
  },
  set exports(v) {
    isHexColorExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isHexColor2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var hexcolor = /^#?([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i;
  function isHexColor2(str) {
    (0, _assertString2.default)(str);
    return hexcolor.test(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isHexColor, isHexColorExports);
var isRgbColorExports = {};
var isRgbColor = {
  get exports() {
    return isRgbColorExports;
  },
  set exports(v) {
    isRgbColorExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isRgbColor2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var rgbColor = /^rgb\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){2}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\)$/;
  var rgbaColor = /^rgba\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){3}(0?\.\d|1(\.0)?|0(\.0)?)\)$/;
  var rgbColorPercent = /^rgb\((([0-9]%|[1-9][0-9]%|100%),){2}([0-9]%|[1-9][0-9]%|100%)\)$/;
  var rgbaColorPercent = /^rgba\((([0-9]%|[1-9][0-9]%|100%),){3}(0?\.\d|1(\.0)?|0(\.0)?)\)$/;
  function isRgbColor2(str) {
    var includePercentValues = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    (0, _assertString2.default)(str);
    if (!includePercentValues) {
      return rgbColor.test(str) || rgbaColor.test(str);
    }
    return rgbColor.test(str) || rgbaColor.test(str) || rgbColorPercent.test(str) || rgbaColorPercent.test(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isRgbColor, isRgbColorExports);
var isHSLExports = {};
var isHSL = {
  get exports() {
    return isHSLExports;
  },
  set exports(v) {
    isHSLExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isHSL2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var hslComma = /^hsla?\(((\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?))(deg|grad|rad|turn)?(,(\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?)%){2}(,((\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?)%?))?\)$/i;
  var hslSpace = /^hsla?\(((\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?))(deg|grad|rad|turn)?(\s(\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?)%){2}\s?(\/\s((\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?)%?)\s?)?\)$/i;
  function isHSL2(str) {
    (0, _assertString2.default)(str);
    var strippedStr = str.replace(/\s+/g, " ").replace(/\s?(hsla?\(|\)|,)\s?/ig, "$1");
    if (strippedStr.indexOf(",") !== -1) {
      return hslComma.test(strippedStr);
    }
    return hslSpace.test(strippedStr);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isHSL, isHSLExports);
var isISRCExports = {};
var isISRC = {
  get exports() {
    return isISRCExports;
  },
  set exports(v) {
    isISRCExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isISRC2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var isrc = /^[A-Z]{2}[0-9A-Z]{3}\d{2}\d{5}$/;
  function isISRC2(str) {
    (0, _assertString2.default)(str);
    return isrc.test(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isISRC, isISRCExports);
var isIBAN$1 = {};
Object.defineProperty(isIBAN$1, "__esModule", {
  value: true
});
isIBAN$1.default = isIBAN;
isIBAN$1.locales = void 0;
var _assertString$5 = _interopRequireDefault$5(assertStringExports);
function _interopRequireDefault$5(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
var ibanRegexThroughCountryCode = {
  AD: /^(AD[0-9]{2})\d{8}[A-Z0-9]{12}$/,
  AE: /^(AE[0-9]{2})\d{3}\d{16}$/,
  AL: /^(AL[0-9]{2})\d{8}[A-Z0-9]{16}$/,
  AT: /^(AT[0-9]{2})\d{16}$/,
  AZ: /^(AZ[0-9]{2})[A-Z0-9]{4}\d{20}$/,
  BA: /^(BA[0-9]{2})\d{16}$/,
  BE: /^(BE[0-9]{2})\d{12}$/,
  BG: /^(BG[0-9]{2})[A-Z]{4}\d{6}[A-Z0-9]{8}$/,
  BH: /^(BH[0-9]{2})[A-Z]{4}[A-Z0-9]{14}$/,
  BR: /^(BR[0-9]{2})\d{23}[A-Z]{1}[A-Z0-9]{1}$/,
  BY: /^(BY[0-9]{2})[A-Z0-9]{4}\d{20}$/,
  CH: /^(CH[0-9]{2})\d{5}[A-Z0-9]{12}$/,
  CR: /^(CR[0-9]{2})\d{18}$/,
  CY: /^(CY[0-9]{2})\d{8}[A-Z0-9]{16}$/,
  CZ: /^(CZ[0-9]{2})\d{20}$/,
  DE: /^(DE[0-9]{2})\d{18}$/,
  DK: /^(DK[0-9]{2})\d{14}$/,
  DO: /^(DO[0-9]{2})[A-Z]{4}\d{20}$/,
  EE: /^(EE[0-9]{2})\d{16}$/,
  EG: /^(EG[0-9]{2})\d{25}$/,
  ES: /^(ES[0-9]{2})\d{20}$/,
  FI: /^(FI[0-9]{2})\d{14}$/,
  FO: /^(FO[0-9]{2})\d{14}$/,
  FR: /^(FR[0-9]{2})\d{10}[A-Z0-9]{11}\d{2}$/,
  GB: /^(GB[0-9]{2})[A-Z]{4}\d{14}$/,
  GE: /^(GE[0-9]{2})[A-Z0-9]{2}\d{16}$/,
  GI: /^(GI[0-9]{2})[A-Z]{4}[A-Z0-9]{15}$/,
  GL: /^(GL[0-9]{2})\d{14}$/,
  GR: /^(GR[0-9]{2})\d{7}[A-Z0-9]{16}$/,
  GT: /^(GT[0-9]{2})[A-Z0-9]{4}[A-Z0-9]{20}$/,
  HR: /^(HR[0-9]{2})\d{17}$/,
  HU: /^(HU[0-9]{2})\d{24}$/,
  IE: /^(IE[0-9]{2})[A-Z0-9]{4}\d{14}$/,
  IL: /^(IL[0-9]{2})\d{19}$/,
  IQ: /^(IQ[0-9]{2})[A-Z]{4}\d{15}$/,
  IR: /^(IR[0-9]{2})0\d{2}0\d{18}$/,
  IS: /^(IS[0-9]{2})\d{22}$/,
  IT: /^(IT[0-9]{2})[A-Z]{1}\d{10}[A-Z0-9]{12}$/,
  JO: /^(JO[0-9]{2})[A-Z]{4}\d{22}$/,
  KW: /^(KW[0-9]{2})[A-Z]{4}[A-Z0-9]{22}$/,
  KZ: /^(KZ[0-9]{2})\d{3}[A-Z0-9]{13}$/,
  LB: /^(LB[0-9]{2})\d{4}[A-Z0-9]{20}$/,
  LC: /^(LC[0-9]{2})[A-Z]{4}[A-Z0-9]{24}$/,
  LI: /^(LI[0-9]{2})\d{5}[A-Z0-9]{12}$/,
  LT: /^(LT[0-9]{2})\d{16}$/,
  LU: /^(LU[0-9]{2})\d{3}[A-Z0-9]{13}$/,
  LV: /^(LV[0-9]{2})[A-Z]{4}[A-Z0-9]{13}$/,
  MC: /^(MC[0-9]{2})\d{10}[A-Z0-9]{11}\d{2}$/,
  MD: /^(MD[0-9]{2})[A-Z0-9]{20}$/,
  ME: /^(ME[0-9]{2})\d{18}$/,
  MK: /^(MK[0-9]{2})\d{3}[A-Z0-9]{10}\d{2}$/,
  MR: /^(MR[0-9]{2})\d{23}$/,
  MT: /^(MT[0-9]{2})[A-Z]{4}\d{5}[A-Z0-9]{18}$/,
  MU: /^(MU[0-9]{2})[A-Z]{4}\d{19}[A-Z]{3}$/,
  MZ: /^(MZ[0-9]{2})\d{21}$/,
  NL: /^(NL[0-9]{2})[A-Z]{4}\d{10}$/,
  NO: /^(NO[0-9]{2})\d{11}$/,
  PK: /^(PK[0-9]{2})[A-Z0-9]{4}\d{16}$/,
  PL: /^(PL[0-9]{2})\d{24}$/,
  PS: /^(PS[0-9]{2})[A-Z0-9]{4}\d{21}$/,
  PT: /^(PT[0-9]{2})\d{21}$/,
  QA: /^(QA[0-9]{2})[A-Z]{4}[A-Z0-9]{21}$/,
  RO: /^(RO[0-9]{2})[A-Z]{4}[A-Z0-9]{16}$/,
  RS: /^(RS[0-9]{2})\d{18}$/,
  SA: /^(SA[0-9]{2})\d{2}[A-Z0-9]{18}$/,
  SC: /^(SC[0-9]{2})[A-Z]{4}\d{20}[A-Z]{3}$/,
  SE: /^(SE[0-9]{2})\d{20}$/,
  SI: /^(SI[0-9]{2})\d{15}$/,
  SK: /^(SK[0-9]{2})\d{20}$/,
  SM: /^(SM[0-9]{2})[A-Z]{1}\d{10}[A-Z0-9]{12}$/,
  SV: /^(SV[0-9]{2})[A-Z0-9]{4}\d{20}$/,
  TL: /^(TL[0-9]{2})\d{19}$/,
  TN: /^(TN[0-9]{2})\d{20}$/,
  TR: /^(TR[0-9]{2})\d{5}[A-Z0-9]{17}$/,
  UA: /^(UA[0-9]{2})\d{6}[A-Z0-9]{19}$/,
  VA: /^(VA[0-9]{2})\d{18}$/,
  VG: /^(VG[0-9]{2})[A-Z0-9]{4}\d{16}$/,
  XK: /^(XK[0-9]{2})\d{16}$/
};
function hasValidIbanFormat(str) {
  var strippedStr = str.replace(/[\s\-]+/gi, "").toUpperCase();
  var isoCountryCode = strippedStr.slice(0, 2).toUpperCase();
  return isoCountryCode in ibanRegexThroughCountryCode && ibanRegexThroughCountryCode[isoCountryCode].test(strippedStr);
}
function hasValidIbanChecksum(str) {
  var strippedStr = str.replace(/[^A-Z0-9]+/gi, "").toUpperCase();
  var rearranged = strippedStr.slice(4) + strippedStr.slice(0, 4);
  var alphaCapsReplacedWithDigits = rearranged.replace(/[A-Z]/g, function(char) {
    return char.charCodeAt(0) - 55;
  });
  var remainder = alphaCapsReplacedWithDigits.match(/\d{1,7}/g).reduce(function(acc, value) {
    return Number(acc + value) % 97;
  }, "");
  return remainder === 1;
}
function isIBAN(str) {
  (0, _assertString$5.default)(str);
  return hasValidIbanFormat(str) && hasValidIbanChecksum(str);
}
var locales$2 = Object.keys(ibanRegexThroughCountryCode);
isIBAN$1.locales = locales$2;
var isBICExports = {};
var isBIC = {
  get exports() {
    return isBICExports;
  },
  set exports(v) {
    isBICExports = v;
  }
};
var isISO31661Alpha2$1 = {};
Object.defineProperty(isISO31661Alpha2$1, "__esModule", {
  value: true
});
isISO31661Alpha2$1.default = isISO31661Alpha2;
isISO31661Alpha2$1.CountryCodes = void 0;
var _assertString$4 = _interopRequireDefault$4(assertStringExports);
function _interopRequireDefault$4(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
var validISO31661Alpha2CountriesCodes = /* @__PURE__ */ new Set(["AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "YE", "YT", "ZA", "ZM", "ZW"]);
function isISO31661Alpha2(str) {
  (0, _assertString$4.default)(str);
  return validISO31661Alpha2CountriesCodes.has(str.toUpperCase());
}
var CountryCodes = validISO31661Alpha2CountriesCodes;
isISO31661Alpha2$1.CountryCodes = CountryCodes;
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isBIC2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var _isISO31661Alpha = isISO31661Alpha2$1;
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var isBICReg = /^[A-Za-z]{6}[A-Za-z0-9]{2}([A-Za-z0-9]{3})?$/;
  function isBIC2(str) {
    (0, _assertString2.default)(str);
    var countryCode = str.slice(4, 6).toUpperCase();
    if (!_isISO31661Alpha.CountryCodes.has(countryCode) && countryCode !== "XK") {
      return false;
    }
    return isBICReg.test(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isBIC, isBICExports);
var isMD5Exports = {};
var isMD5 = {
  get exports() {
    return isMD5Exports;
  },
  set exports(v) {
    isMD5Exports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isMD52;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var md5 = /^[a-f0-9]{32}$/;
  function isMD52(str) {
    (0, _assertString2.default)(str);
    return md5.test(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isMD5, isMD5Exports);
var isHashExports = {};
var isHash = {
  get exports() {
    return isHashExports;
  },
  set exports(v) {
    isHashExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isHash2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var lengths = {
    md5: 32,
    md4: 32,
    sha1: 40,
    sha256: 64,
    sha384: 96,
    sha512: 128,
    ripemd128: 32,
    ripemd160: 40,
    tiger128: 32,
    tiger160: 40,
    tiger192: 48,
    crc32: 8,
    crc32b: 8
  };
  function isHash2(str, algorithm) {
    (0, _assertString2.default)(str);
    var hash = new RegExp("^[a-fA-F0-9]{".concat(lengths[algorithm], "}$"));
    return hash.test(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isHash, isHashExports);
var isJWTExports = {};
var isJWT = {
  get exports() {
    return isJWTExports;
  },
  set exports(v) {
    isJWTExports = v;
  }
};
var isBase64Exports = {};
var isBase64 = {
  get exports() {
    return isBase64Exports;
  },
  set exports(v) {
    isBase64Exports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isBase642;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var _merge = _interopRequireDefault2(mergeExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var notBase64 = /[^A-Z0-9+\/=]/i;
  var urlSafeBase64 = /^[A-Z0-9_\-]*$/i;
  var defaultBase64Options = {
    urlSafe: false
  };
  function isBase642(str, options) {
    (0, _assertString2.default)(str);
    options = (0, _merge.default)(options, defaultBase64Options);
    var len = str.length;
    if (options.urlSafe) {
      return urlSafeBase64.test(str);
    }
    if (len % 4 !== 0 || notBase64.test(str)) {
      return false;
    }
    var firstPaddingChar = str.indexOf("=");
    return firstPaddingChar === -1 || firstPaddingChar === len - 1 || firstPaddingChar === len - 2 && str[len - 1] === "=";
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isBase64, isBase64Exports);
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isJWT2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var _isBase = _interopRequireDefault2(isBase64Exports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function isJWT2(str) {
    (0, _assertString2.default)(str);
    var dotSplit = str.split(".");
    var len = dotSplit.length;
    if (len > 3 || len < 2) {
      return false;
    }
    return dotSplit.reduce(function(acc, currElem) {
      return acc && (0, _isBase.default)(currElem, {
        urlSafe: true
      });
    }, true);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isJWT, isJWTExports);
var isJSONExports = {};
var isJSON = {
  get exports() {
    return isJSONExports;
  },
  set exports(v) {
    isJSONExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isJSON2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var _merge = _interopRequireDefault2(mergeExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function _typeof2(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof2 = function _typeof3(obj2) {
        return typeof obj2;
      };
    } else {
      _typeof2 = function _typeof3(obj2) {
        return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
      };
    }
    return _typeof2(obj);
  }
  var default_json_options = {
    allow_primitives: false
  };
  function isJSON2(str, options) {
    (0, _assertString2.default)(str);
    try {
      options = (0, _merge.default)(options, default_json_options);
      var primitives = [];
      if (options.allow_primitives) {
        primitives = [null, false, true];
      }
      var obj = JSON.parse(str);
      return primitives.includes(obj) || !!obj && _typeof2(obj) === "object";
    } catch (e) {
    }
    return false;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isJSON, isJSONExports);
var isEmptyExports = {};
var isEmpty = {
  get exports() {
    return isEmptyExports;
  },
  set exports(v) {
    isEmptyExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isEmpty2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var _merge = _interopRequireDefault2(mergeExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var default_is_empty_options = {
    ignore_whitespace: false
  };
  function isEmpty2(str, options) {
    (0, _assertString2.default)(str);
    options = (0, _merge.default)(options, default_is_empty_options);
    return (options.ignore_whitespace ? str.trim().length : str.length) === 0;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isEmpty, isEmptyExports);
var isLengthExports = {};
var isLength = {
  get exports() {
    return isLengthExports;
  },
  set exports(v) {
    isLengthExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isLength2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function _typeof2(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof2 = function _typeof3(obj2) {
        return typeof obj2;
      };
    } else {
      _typeof2 = function _typeof3(obj2) {
        return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
      };
    }
    return _typeof2(obj);
  }
  function isLength2(str, options) {
    (0, _assertString2.default)(str);
    var min;
    var max;
    if (_typeof2(options) === "object") {
      min = options.min || 0;
      max = options.max;
    } else {
      min = arguments[1] || 0;
      max = arguments[2];
    }
    var presentationSequences = str.match(/(\uFE0F|\uFE0E)/g) || [];
    var surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [];
    var len = str.length - presentationSequences.length - surrogatePairs.length;
    return len >= min && (typeof max === "undefined" || len <= max);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isLength, isLengthExports);
var isUUIDExports = {};
var isUUID = {
  get exports() {
    return isUUIDExports;
  },
  set exports(v) {
    isUUIDExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isUUID2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var uuid = {
    1: /^[0-9A-F]{8}-[0-9A-F]{4}-1[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
    2: /^[0-9A-F]{8}-[0-9A-F]{4}-2[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
    3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
    4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
  };
  function isUUID2(str, version2) {
    (0, _assertString2.default)(str);
    var pattern = uuid[![void 0, null].includes(version2) ? version2 : "all"];
    return !!pattern && pattern.test(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isUUID, isUUIDExports);
var isMongoIdExports = {};
var isMongoId = {
  get exports() {
    return isMongoIdExports;
  },
  set exports(v) {
    isMongoIdExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isMongoId2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var _isHexadecimal = _interopRequireDefault2(isHexadecimalExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function isMongoId2(str) {
    (0, _assertString2.default)(str);
    return (0, _isHexadecimal.default)(str) && str.length === 24;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isMongoId, isMongoIdExports);
var isAfterExports = {};
var isAfter = {
  get exports() {
    return isAfterExports;
  },
  set exports(v) {
    isAfterExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isAfter2;
  var _toDate = _interopRequireDefault2(toDateExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function isAfter2(date, options) {
    var comparisonDate = (options === null || options === void 0 ? void 0 : options.comparisonDate) || options || Date().toString();
    var comparison = (0, _toDate.default)(comparisonDate);
    var original = (0, _toDate.default)(date);
    return !!(original && comparison && original > comparison);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isAfter, isAfterExports);
var isBeforeExports = {};
var isBefore = {
  get exports() {
    return isBeforeExports;
  },
  set exports(v) {
    isBeforeExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isBefore2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var _toDate = _interopRequireDefault2(toDateExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function isBefore2(str) {
    var date = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : String(new Date());
    (0, _assertString2.default)(str);
    var comparison = (0, _toDate.default)(date);
    var original = (0, _toDate.default)(str);
    return !!(original && comparison && original < comparison);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isBefore, isBeforeExports);
var isInExports = {};
var isIn = {
  get exports() {
    return isInExports;
  },
  set exports(v) {
    isInExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isIn2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var _toString = _interopRequireDefault2(toStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function _typeof2(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof2 = function _typeof3(obj2) {
        return typeof obj2;
      };
    } else {
      _typeof2 = function _typeof3(obj2) {
        return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
      };
    }
    return _typeof2(obj);
  }
  function isIn2(str, options) {
    (0, _assertString2.default)(str);
    var i;
    if (Object.prototype.toString.call(options) === "[object Array]") {
      var array = [];
      for (i in options) {
        if ({}.hasOwnProperty.call(options, i)) {
          array[i] = (0, _toString.default)(options[i]);
        }
      }
      return array.indexOf(str) >= 0;
    } else if (_typeof2(options) === "object") {
      return options.hasOwnProperty(str);
    } else if (options && typeof options.indexOf === "function") {
      return options.indexOf(str) >= 0;
    }
    return false;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isIn, isInExports);
var isLuhnNumberExports = {};
var isLuhnNumber = {
  get exports() {
    return isLuhnNumberExports;
  },
  set exports(v) {
    isLuhnNumberExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isLuhnNumber2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function isLuhnNumber2(str) {
    (0, _assertString2.default)(str);
    var sanitized = str.replace(/[- ]+/g, "");
    var sum = 0;
    var digit;
    var tmpNum;
    var shouldDouble;
    for (var i = sanitized.length - 1; i >= 0; i--) {
      digit = sanitized.substring(i, i + 1);
      tmpNum = parseInt(digit, 10);
      if (shouldDouble) {
        tmpNum *= 2;
        if (tmpNum >= 10) {
          sum += tmpNum % 10 + 1;
        } else {
          sum += tmpNum;
        }
      } else {
        sum += tmpNum;
      }
      shouldDouble = !shouldDouble;
    }
    return !!(sum % 10 === 0 ? sanitized : false);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isLuhnNumber, isLuhnNumberExports);
var isCreditCardExports = {};
var isCreditCard = {
  get exports() {
    return isCreditCardExports;
  },
  set exports(v) {
    isCreditCardExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isCreditCard2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var _isLuhnNumber = _interopRequireDefault2(isLuhnNumberExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var cards = {
    amex: /^3[47][0-9]{13}$/,
    dinersclub: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    discover: /^6(?:011|5[0-9][0-9])[0-9]{12,15}$/,
    jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
    mastercard: /^5[1-5][0-9]{2}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/,
    // /^[25][1-7][0-9]{14}$/;
    unionpay: /^(6[27][0-9]{14}|^(81[0-9]{14,17}))$/,
    visa: /^(?:4[0-9]{12})(?:[0-9]{3,6})?$/
  };
  var allCards = /^(?:4[0-9]{12}(?:[0-9]{3,6})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12,15}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11}|6[27][0-9]{14}|^(81[0-9]{14,17}))$/;
  function isCreditCard2(card) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    (0, _assertString2.default)(card);
    var provider = options.provider;
    var sanitized = card.replace(/[- ]+/g, "");
    if (provider && provider.toLowerCase() in cards) {
      if (!cards[provider.toLowerCase()].test(sanitized)) {
        return false;
      }
    } else if (provider && !(provider.toLowerCase() in cards)) {
      throw new Error("".concat(provider, " is not a valid credit card provider."));
    } else if (!allCards.test(sanitized)) {
      return false;
    }
    return (0, _isLuhnNumber.default)(card);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isCreditCard, isCreditCardExports);
var isIdentityCardExports = {};
var isIdentityCard = {
  get exports() {
    return isIdentityCardExports;
  },
  set exports(v) {
    isIdentityCardExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isIdentityCard2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var _isInt = _interopRequireDefault2(isIntExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var validators = {
    PL: function PL2(str) {
      (0, _assertString2.default)(str);
      var weightOfDigits = {
        1: 1,
        2: 3,
        3: 7,
        4: 9,
        5: 1,
        6: 3,
        7: 7,
        8: 9,
        9: 1,
        10: 3,
        11: 0
      };
      if (str != null && str.length === 11 && (0, _isInt.default)(str, {
        allow_leading_zeroes: true
      })) {
        var digits = str.split("").slice(0, -1);
        var sum = digits.reduce(function(acc, digit, index) {
          return acc + Number(digit) * weightOfDigits[index + 1];
        }, 0);
        var modulo = sum % 10;
        var lastDigit = Number(str.charAt(str.length - 1));
        if (modulo === 0 && lastDigit === 0 || lastDigit === 10 - modulo) {
          return true;
        }
      }
      return false;
    },
    ES: function ES2(str) {
      (0, _assertString2.default)(str);
      var DNI = /^[0-9X-Z][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/;
      var charsValue = {
        X: 0,
        Y: 1,
        Z: 2
      };
      var controlDigits = ["T", "R", "W", "A", "G", "M", "Y", "F", "P", "D", "X", "B", "N", "J", "Z", "S", "Q", "V", "H", "L", "C", "K", "E"];
      var sanitized = str.trim().toUpperCase();
      if (!DNI.test(sanitized)) {
        return false;
      }
      var number = sanitized.slice(0, -1).replace(/[X,Y,Z]/g, function(char) {
        return charsValue[char];
      });
      return sanitized.endsWith(controlDigits[number % 23]);
    },
    FI: function FI2(str) {
      (0, _assertString2.default)(str);
      if (str.length !== 11) {
        return false;
      }
      if (!str.match(/^\d{6}[\-A\+]\d{3}[0-9ABCDEFHJKLMNPRSTUVWXY]{1}$/)) {
        return false;
      }
      var checkDigits = "0123456789ABCDEFHJKLMNPRSTUVWXY";
      var idAsNumber = parseInt(str.slice(0, 6), 10) * 1e3 + parseInt(str.slice(7, 10), 10);
      var remainder = idAsNumber % 31;
      var checkDigit = checkDigits[remainder];
      return checkDigit === str.slice(10, 11);
    },
    IN: function IN2(str) {
      var DNI = /^[1-9]\d{3}\s?\d{4}\s?\d{4}$/;
      var d = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 0, 6, 7, 8, 9, 5], [2, 3, 4, 0, 1, 7, 8, 9, 5, 6], [3, 4, 0, 1, 2, 8, 9, 5, 6, 7], [4, 0, 1, 2, 3, 9, 5, 6, 7, 8], [5, 9, 8, 7, 6, 0, 4, 3, 2, 1], [6, 5, 9, 8, 7, 1, 0, 4, 3, 2], [7, 6, 5, 9, 8, 2, 1, 0, 4, 3], [8, 7, 6, 5, 9, 3, 2, 1, 0, 4], [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]];
      var p2 = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 5, 7, 6, 2, 8, 3, 0, 9, 4], [5, 8, 0, 3, 7, 9, 6, 1, 4, 2], [8, 9, 1, 6, 0, 4, 3, 5, 2, 7], [9, 4, 5, 3, 1, 2, 6, 8, 7, 0], [4, 2, 8, 6, 5, 7, 3, 9, 0, 1], [2, 7, 9, 3, 8, 0, 6, 4, 1, 5], [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]];
      var sanitized = str.trim();
      if (!DNI.test(sanitized)) {
        return false;
      }
      var c = 0;
      var invertedArray = sanitized.replace(/\s/g, "").split("").map(Number).reverse();
      invertedArray.forEach(function(val, i) {
        c = d[c][p2[i % 8][val]];
      });
      return c === 0;
    },
    IR: function IR(str) {
      if (!str.match(/^\d{10}$/))
        return false;
      str = "0000".concat(str).slice(str.length - 6);
      if (parseInt(str.slice(3, 9), 10) === 0)
        return false;
      var lastNumber = parseInt(str.slice(9, 10), 10);
      var sum = 0;
      for (var i = 0; i < 9; i++) {
        sum += parseInt(str.slice(i, i + 1), 10) * (10 - i);
      }
      sum %= 11;
      return sum < 2 && lastNumber === sum || sum >= 2 && lastNumber === 11 - sum;
    },
    IT: function IT2(str) {
      if (str.length !== 9)
        return false;
      if (str === "CA00000AA")
        return false;
      return str.search(/C[A-Z][0-9]{5}[A-Z]{2}/i) > -1;
    },
    NO: function NO3(str) {
      var sanitized = str.trim();
      if (isNaN(Number(sanitized)))
        return false;
      if (sanitized.length !== 11)
        return false;
      if (sanitized === "00000000000")
        return false;
      var f = sanitized.split("").map(Number);
      var k1 = (11 - (3 * f[0] + 7 * f[1] + 6 * f[2] + 1 * f[3] + 8 * f[4] + 9 * f[5] + 4 * f[6] + 5 * f[7] + 2 * f[8]) % 11) % 11;
      var k2 = (11 - (5 * f[0] + 4 * f[1] + 3 * f[2] + 2 * f[3] + 7 * f[4] + 6 * f[5] + 5 * f[6] + 4 * f[7] + 3 * f[8] + 2 * k1) % 11) % 11;
      if (k1 !== f[9] || k2 !== f[10])
        return false;
      return true;
    },
    TH: function TH(str) {
      if (!str.match(/^[1-8]\d{12}$/))
        return false;
      var sum = 0;
      for (var i = 0; i < 12; i++) {
        sum += parseInt(str[i], 10) * (13 - i);
      }
      return str[12] === ((11 - sum % 11) % 10).toString();
    },
    LK: function LK(str) {
      var old_nic = /^[1-9]\d{8}[vx]$/i;
      var new_nic = /^[1-9]\d{11}$/i;
      if (str.length === 10 && old_nic.test(str))
        return true;
      else if (str.length === 12 && new_nic.test(str))
        return true;
      return false;
    },
    "he-IL": function heIL(str) {
      var DNI = /^\d{9}$/;
      var sanitized = str.trim();
      if (!DNI.test(sanitized)) {
        return false;
      }
      var id = sanitized;
      var sum = 0, incNum;
      for (var i = 0; i < id.length; i++) {
        incNum = Number(id[i]) * (i % 2 + 1);
        sum += incNum > 9 ? incNum - 9 : incNum;
      }
      return sum % 10 === 0;
    },
    "ar-LY": function arLY(str) {
      var NIN = /^(1|2)\d{11}$/;
      var sanitized = str.trim();
      if (!NIN.test(sanitized)) {
        return false;
      }
      return true;
    },
    "ar-TN": function arTN(str) {
      var DNI = /^\d{8}$/;
      var sanitized = str.trim();
      if (!DNI.test(sanitized)) {
        return false;
      }
      return true;
    },
    "zh-CN": function zhCN(str) {
      var provincesAndCities = [
        "11",
        // 北京
        "12",
        // 天津
        "13",
        // 河北
        "14",
        // 山西
        "15",
        // 内蒙古
        "21",
        // 辽宁
        "22",
        // 吉林
        "23",
        // 黑龙江
        "31",
        // 上海
        "32",
        // 江苏
        "33",
        // 浙江
        "34",
        // 安徽
        "35",
        // 福建
        "36",
        // 江西
        "37",
        // 山东
        "41",
        // 河南
        "42",
        // 湖北
        "43",
        // 湖南
        "44",
        // 广东
        "45",
        // 广西
        "46",
        // 海南
        "50",
        // 重庆
        "51",
        // 四川
        "52",
        // 贵州
        "53",
        // 云南
        "54",
        // 西藏
        "61",
        // 陕西
        "62",
        // 甘肃
        "63",
        // 青海
        "64",
        // 宁夏
        "65",
        // 新疆
        "71",
        // 台湾
        "81",
        // 香港
        "82",
        // 澳门
        "91"
        // 国外
      ];
      var powers = ["7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2"];
      var parityBit = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
      var checkAddressCode = function checkAddressCode2(addressCode) {
        return provincesAndCities.includes(addressCode);
      };
      var checkBirthDayCode = function checkBirthDayCode2(birDayCode) {
        var yyyy = parseInt(birDayCode.substring(0, 4), 10);
        var mm = parseInt(birDayCode.substring(4, 6), 10);
        var dd = parseInt(birDayCode.substring(6), 10);
        var xdata = new Date(yyyy, mm - 1, dd);
        if (xdata > new Date()) {
          return false;
        } else if (xdata.getFullYear() === yyyy && xdata.getMonth() === mm - 1 && xdata.getDate() === dd) {
          return true;
        }
        return false;
      };
      var getParityBit = function getParityBit2(idCardNo) {
        var id17 = idCardNo.substring(0, 17);
        var power = 0;
        for (var i = 0; i < 17; i++) {
          power += parseInt(id17.charAt(i), 10) * parseInt(powers[i], 10);
        }
        var mod = power % 11;
        return parityBit[mod];
      };
      var checkParityBit = function checkParityBit2(idCardNo) {
        return getParityBit(idCardNo) === idCardNo.charAt(17).toUpperCase();
      };
      var check15IdCardNo = function check15IdCardNo2(idCardNo) {
        var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(idCardNo);
        if (!check)
          return false;
        var addressCode = idCardNo.substring(0, 2);
        check = checkAddressCode(addressCode);
        if (!check)
          return false;
        var birDayCode = "19".concat(idCardNo.substring(6, 12));
        check = checkBirthDayCode(birDayCode);
        if (!check)
          return false;
        return true;
      };
      var check18IdCardNo = function check18IdCardNo2(idCardNo) {
        var check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(idCardNo);
        if (!check)
          return false;
        var addressCode = idCardNo.substring(0, 2);
        check = checkAddressCode(addressCode);
        if (!check)
          return false;
        var birDayCode = idCardNo.substring(6, 14);
        check = checkBirthDayCode(birDayCode);
        if (!check)
          return false;
        return checkParityBit(idCardNo);
      };
      var checkIdCardNo = function checkIdCardNo2(idCardNo) {
        var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
        if (!check)
          return false;
        if (idCardNo.length === 15) {
          return check15IdCardNo(idCardNo);
        }
        return check18IdCardNo(idCardNo);
      };
      return checkIdCardNo(str);
    },
    "zh-HK": function zhHK(str) {
      str = str.trim();
      var regexHKID = /^[A-Z]{1,2}[0-9]{6}((\([0-9A]\))|(\[[0-9A]\])|([0-9A]))$/;
      var regexIsDigit = /^[0-9]$/;
      str = str.toUpperCase();
      if (!regexHKID.test(str))
        return false;
      str = str.replace(/\[|\]|\(|\)/g, "");
      if (str.length === 8)
        str = "3".concat(str);
      var checkSumVal = 0;
      for (var i = 0; i <= 7; i++) {
        var convertedChar = void 0;
        if (!regexIsDigit.test(str[i]))
          convertedChar = (str[i].charCodeAt(0) - 55) % 11;
        else
          convertedChar = str[i];
        checkSumVal += convertedChar * (9 - i);
      }
      checkSumVal %= 11;
      var checkSumConverted;
      if (checkSumVal === 0)
        checkSumConverted = "0";
      else if (checkSumVal === 1)
        checkSumConverted = "A";
      else
        checkSumConverted = String(11 - checkSumVal);
      if (checkSumConverted === str[str.length - 1])
        return true;
      return false;
    },
    "zh-TW": function zhTW(str) {
      var ALPHABET_CODES = {
        A: 10,
        B: 11,
        C: 12,
        D: 13,
        E: 14,
        F: 15,
        G: 16,
        H: 17,
        I: 34,
        J: 18,
        K: 19,
        L: 20,
        M: 21,
        N: 22,
        O: 35,
        P: 23,
        Q: 24,
        R: 25,
        S: 26,
        T: 27,
        U: 28,
        V: 29,
        W: 32,
        X: 30,
        Y: 31,
        Z: 33
      };
      var sanitized = str.trim().toUpperCase();
      if (!/^[A-Z][0-9]{9}$/.test(sanitized))
        return false;
      return Array.from(sanitized).reduce(function(sum, number, index) {
        if (index === 0) {
          var code = ALPHABET_CODES[number];
          return code % 10 * 9 + Math.floor(code / 10);
        }
        if (index === 9) {
          return (10 - sum % 10 - Number(number)) % 10 === 0;
        }
        return sum + Number(number) * (9 - index);
      }, 0);
    }
  };
  function isIdentityCard2(str, locale) {
    (0, _assertString2.default)(str);
    if (locale in validators) {
      return validators[locale](str);
    } else if (locale === "any") {
      for (var key in validators) {
        if (validators.hasOwnProperty(key)) {
          var validator2 = validators[key];
          if (validator2(str)) {
            return true;
          }
        }
      }
      return false;
    }
    throw new Error("Invalid locale '".concat(locale, "'"));
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isIdentityCard, isIdentityCardExports);
var isEANExports = {};
var isEAN = {
  get exports() {
    return isEANExports;
  },
  set exports(v) {
    isEANExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isEAN2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var LENGTH_EAN_8 = 8;
  var LENGTH_EAN_14 = 14;
  var validEanRegex = /^(\d{8}|\d{13}|\d{14})$/;
  function getPositionWeightThroughLengthAndIndex(length, index) {
    if (length === LENGTH_EAN_8 || length === LENGTH_EAN_14) {
      return index % 2 === 0 ? 3 : 1;
    }
    return index % 2 === 0 ? 1 : 3;
  }
  function calculateCheckDigit(ean) {
    var checksum = ean.slice(0, -1).split("").map(function(char, index) {
      return Number(char) * getPositionWeightThroughLengthAndIndex(ean.length, index);
    }).reduce(function(acc, partialSum) {
      return acc + partialSum;
    }, 0);
    var remainder = 10 - checksum % 10;
    return remainder < 10 ? remainder : 0;
  }
  function isEAN2(str) {
    (0, _assertString2.default)(str);
    var actualCheckDigit = Number(str.slice(-1));
    return validEanRegex.test(str) && actualCheckDigit === calculateCheckDigit(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isEAN, isEANExports);
var isISINExports = {};
var isISIN = {
  get exports() {
    return isISINExports;
  },
  set exports(v) {
    isISINExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isISIN2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var isin = /^[A-Z]{2}[0-9A-Z]{9}[0-9]$/;
  function isISIN2(str) {
    (0, _assertString2.default)(str);
    if (!isin.test(str)) {
      return false;
    }
    var double = true;
    var sum = 0;
    for (var i = str.length - 2; i >= 0; i--) {
      if (str[i] >= "A" && str[i] <= "Z") {
        var value = str[i].charCodeAt(0) - 55;
        var lo = value % 10;
        var hi = Math.trunc(value / 10);
        for (var _i = 0, _arr = [lo, hi]; _i < _arr.length; _i++) {
          var digit = _arr[_i];
          if (double) {
            if (digit >= 5) {
              sum += 1 + (digit - 5) * 2;
            } else {
              sum += digit * 2;
            }
          } else {
            sum += digit;
          }
          double = !double;
        }
      } else {
        var _digit = str[i].charCodeAt(0) - "0".charCodeAt(0);
        if (double) {
          if (_digit >= 5) {
            sum += 1 + (_digit - 5) * 2;
          } else {
            sum += _digit * 2;
          }
        } else {
          sum += _digit;
        }
        double = !double;
      }
    }
    var check = Math.trunc((sum + 9) / 10) * 10 - sum;
    return +str[str.length - 1] === check;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isISIN, isISINExports);
var isISBNExports = {};
var isISBN = {
  get exports() {
    return isISBNExports;
  },
  set exports(v) {
    isISBNExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isISBN2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var possibleIsbn10 = /^(?:[0-9]{9}X|[0-9]{10})$/;
  var possibleIsbn13 = /^(?:[0-9]{13})$/;
  var factor = [1, 3];
  function isISBN2(isbn, options) {
    (0, _assertString2.default)(isbn);
    var version2 = String((options === null || options === void 0 ? void 0 : options.version) || options);
    if (!(options !== null && options !== void 0 && options.version || options)) {
      return isISBN2(isbn, {
        version: 10
      }) || isISBN2(isbn, {
        version: 13
      });
    }
    var sanitizedIsbn = isbn.replace(/[\s-]+/g, "");
    var checksum = 0;
    if (version2 === "10") {
      if (!possibleIsbn10.test(sanitizedIsbn)) {
        return false;
      }
      for (var i = 0; i < version2 - 1; i++) {
        checksum += (i + 1) * sanitizedIsbn.charAt(i);
      }
      if (sanitizedIsbn.charAt(9) === "X") {
        checksum += 10 * 10;
      } else {
        checksum += 10 * sanitizedIsbn.charAt(9);
      }
      if (checksum % 11 === 0) {
        return true;
      }
    } else if (version2 === "13") {
      if (!possibleIsbn13.test(sanitizedIsbn)) {
        return false;
      }
      for (var _i = 0; _i < 12; _i++) {
        checksum += factor[_i % 2] * sanitizedIsbn.charAt(_i);
      }
      if (sanitizedIsbn.charAt(12) - (10 - checksum % 10) % 10 === 0) {
        return true;
      }
    }
    return false;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isISBN, isISBNExports);
var isISSNExports = {};
var isISSN = {
  get exports() {
    return isISSNExports;
  },
  set exports(v) {
    isISSNExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isISSN2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var issn = "^\\d{4}-?\\d{3}[\\dX]$";
  function isISSN2(str) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    (0, _assertString2.default)(str);
    var testIssn = issn;
    testIssn = options.require_hyphen ? testIssn.replace("?", "") : testIssn;
    testIssn = options.case_sensitive ? new RegExp(testIssn) : new RegExp(testIssn, "i");
    if (!testIssn.test(str)) {
      return false;
    }
    var digits = str.replace("-", "").toUpperCase();
    var checksum = 0;
    for (var i = 0; i < digits.length; i++) {
      var digit = digits[i];
      checksum += (digit === "X" ? 10 : +digit) * (8 - i);
    }
    return checksum % 11 === 0;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isISSN, isISSNExports);
var isTaxIDExports = {};
var isTaxID = {
  get exports() {
    return isTaxIDExports;
  },
  set exports(v) {
    isTaxIDExports = v;
  }
};
var algorithms$1 = {};
Object.defineProperty(algorithms$1, "__esModule", {
  value: true
});
algorithms$1.iso7064Check = iso7064Check;
algorithms$1.luhnCheck = luhnCheck;
algorithms$1.reverseMultiplyAndSum = reverseMultiplyAndSum;
algorithms$1.verhoeffCheck = verhoeffCheck;
function iso7064Check(str) {
  var checkvalue = 10;
  for (var i = 0; i < str.length - 1; i++) {
    checkvalue = (parseInt(str[i], 10) + checkvalue) % 10 === 0 ? 10 * 2 % 11 : (parseInt(str[i], 10) + checkvalue) % 10 * 2 % 11;
  }
  checkvalue = checkvalue === 1 ? 0 : 11 - checkvalue;
  return checkvalue === parseInt(str[10], 10);
}
function luhnCheck(str) {
  var checksum = 0;
  var second = false;
  for (var i = str.length - 1; i >= 0; i--) {
    if (second) {
      var product = parseInt(str[i], 10) * 2;
      if (product > 9) {
        checksum += product.toString().split("").map(function(a) {
          return parseInt(a, 10);
        }).reduce(function(a, b) {
          return a + b;
        }, 0);
      } else {
        checksum += product;
      }
    } else {
      checksum += parseInt(str[i], 10);
    }
    second = !second;
  }
  return checksum % 10 === 0;
}
function reverseMultiplyAndSum(digits, base) {
  var total = 0;
  for (var i = 0; i < digits.length; i++) {
    total += digits[i] * (base - i);
  }
  return total;
}
function verhoeffCheck(str) {
  var d_table = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 0, 6, 7, 8, 9, 5], [2, 3, 4, 0, 1, 7, 8, 9, 5, 6], [3, 4, 0, 1, 2, 8, 9, 5, 6, 7], [4, 0, 1, 2, 3, 9, 5, 6, 7, 8], [5, 9, 8, 7, 6, 0, 4, 3, 2, 1], [6, 5, 9, 8, 7, 1, 0, 4, 3, 2], [7, 6, 5, 9, 8, 2, 1, 0, 4, 3], [8, 7, 6, 5, 9, 3, 2, 1, 0, 4], [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]];
  var p_table = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 5, 7, 6, 2, 8, 3, 0, 9, 4], [5, 8, 0, 3, 7, 9, 6, 1, 4, 2], [8, 9, 1, 6, 0, 4, 3, 5, 2, 7], [9, 4, 5, 3, 1, 2, 6, 8, 7, 0], [4, 2, 8, 6, 5, 7, 3, 9, 0, 1], [2, 7, 9, 3, 8, 0, 6, 4, 1, 5], [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]];
  var str_copy = str.split("").reverse().join("");
  var checksum = 0;
  for (var i = 0; i < str_copy.length; i++) {
    checksum = d_table[checksum][p_table[i % 8][parseInt(str_copy[i], 10)]];
  }
  return checksum === 0;
}
(function(module, exports) {
  function _typeof2(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof2 = function _typeof3(obj2) {
        return typeof obj2;
      };
    } else {
      _typeof2 = function _typeof3(obj2) {
        return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
      };
    }
    return _typeof2(obj);
  }
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isTaxID2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var algorithms2 = _interopRequireWildcard2(algorithms$1);
  var _isDate = _interopRequireDefault2(isDateExports);
  function _getRequireWildcardCache2() {
    if (typeof WeakMap !== "function")
      return null;
    var cache = /* @__PURE__ */ new WeakMap();
    _getRequireWildcardCache2 = function _getRequireWildcardCache3() {
      return cache;
    };
    return cache;
  }
  function _interopRequireWildcard2(obj) {
    if (obj && obj.__esModule) {
      return obj;
    }
    if (obj === null || _typeof2(obj) !== "object" && typeof obj !== "function") {
      return { default: obj };
    }
    var cache = _getRequireWildcardCache2();
    if (cache && cache.has(obj)) {
      return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj[key];
        }
      }
    }
    newObj.default = obj;
    if (cache) {
      cache.set(obj, newObj);
    }
    return newObj;
  }
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter))
      return Array.from(iter);
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr))
      return _arrayLikeToArray(arr);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
  function bgBgCheck(tin) {
    var century_year = tin.slice(0, 2);
    var month = parseInt(tin.slice(2, 4), 10);
    if (month > 40) {
      month -= 40;
      century_year = "20".concat(century_year);
    } else if (month > 20) {
      month -= 20;
      century_year = "18".concat(century_year);
    } else {
      century_year = "19".concat(century_year);
    }
    if (month < 10) {
      month = "0".concat(month);
    }
    var date = "".concat(century_year, "/").concat(month, "/").concat(tin.slice(4, 6));
    if (!(0, _isDate.default)(date, "YYYY/MM/DD")) {
      return false;
    }
    var digits = tin.split("").map(function(a) {
      return parseInt(a, 10);
    });
    var multip_lookup = [2, 4, 8, 5, 10, 9, 7, 3, 6];
    var checksum = 0;
    for (var i = 0; i < multip_lookup.length; i++) {
      checksum += digits[i] * multip_lookup[i];
    }
    checksum = checksum % 11 === 10 ? 0 : checksum % 11;
    return checksum === digits[9];
  }
  function isCanadianSIN(input) {
    var digitsArray = input.split("");
    var even = digitsArray.filter(function(_, idx) {
      return idx % 2;
    }).map(function(i) {
      return Number(i) * 2;
    }).join("").split("");
    var total = digitsArray.filter(function(_, idx) {
      return !(idx % 2);
    }).concat(even).map(function(i) {
      return Number(i);
    }).reduce(function(acc, cur) {
      return acc + cur;
    });
    return total % 10 === 0;
  }
  function csCzCheck(tin) {
    tin = tin.replace(/\W/, "");
    var full_year = parseInt(tin.slice(0, 2), 10);
    if (tin.length === 10) {
      if (full_year < 54) {
        full_year = "20".concat(full_year);
      } else {
        full_year = "19".concat(full_year);
      }
    } else {
      if (tin.slice(6) === "000") {
        return false;
      }
      if (full_year < 54) {
        full_year = "19".concat(full_year);
      } else {
        return false;
      }
    }
    if (full_year.length === 3) {
      full_year = [full_year.slice(0, 2), "0", full_year.slice(2)].join("");
    }
    var month = parseInt(tin.slice(2, 4), 10);
    if (month > 50) {
      month -= 50;
    }
    if (month > 20) {
      if (parseInt(full_year, 10) < 2004) {
        return false;
      }
      month -= 20;
    }
    if (month < 10) {
      month = "0".concat(month);
    }
    var date = "".concat(full_year, "/").concat(month, "/").concat(tin.slice(4, 6));
    if (!(0, _isDate.default)(date, "YYYY/MM/DD")) {
      return false;
    }
    if (tin.length === 10) {
      if (parseInt(tin, 10) % 11 !== 0) {
        var checkdigit = parseInt(tin.slice(0, 9), 10) % 11;
        if (parseInt(full_year, 10) < 1986 && checkdigit === 10) {
          if (parseInt(tin.slice(9), 10) !== 0) {
            return false;
          }
        } else {
          return false;
        }
      }
    }
    return true;
  }
  function deAtCheck(tin) {
    return algorithms2.luhnCheck(tin);
  }
  function deDeCheck(tin) {
    var digits = tin.split("").map(function(a) {
      return parseInt(a, 10);
    });
    var occurences = [];
    for (var i = 0; i < digits.length - 1; i++) {
      occurences.push("");
      for (var j = 0; j < digits.length - 1; j++) {
        if (digits[i] === digits[j]) {
          occurences[i] += j;
        }
      }
    }
    occurences = occurences.filter(function(a) {
      return a.length > 1;
    });
    if (occurences.length !== 2 && occurences.length !== 3) {
      return false;
    }
    if (occurences[0].length === 3) {
      var trip_locations = occurences[0].split("").map(function(a) {
        return parseInt(a, 10);
      });
      var recurrent = 0;
      for (var _i = 0; _i < trip_locations.length - 1; _i++) {
        if (trip_locations[_i] + 1 === trip_locations[_i + 1]) {
          recurrent += 1;
        }
      }
      if (recurrent === 2) {
        return false;
      }
    }
    return algorithms2.iso7064Check(tin);
  }
  function dkDkCheck(tin) {
    tin = tin.replace(/\W/, "");
    var year = parseInt(tin.slice(4, 6), 10);
    var century_digit = tin.slice(6, 7);
    switch (century_digit) {
      case "0":
      case "1":
      case "2":
      case "3":
        year = "19".concat(year);
        break;
      case "4":
      case "9":
        if (year < 37) {
          year = "20".concat(year);
        } else {
          year = "19".concat(year);
        }
        break;
      default:
        if (year < 37) {
          year = "20".concat(year);
        } else if (year > 58) {
          year = "18".concat(year);
        } else {
          return false;
        }
        break;
    }
    if (year.length === 3) {
      year = [year.slice(0, 2), "0", year.slice(2)].join("");
    }
    var date = "".concat(year, "/").concat(tin.slice(2, 4), "/").concat(tin.slice(0, 2));
    if (!(0, _isDate.default)(date, "YYYY/MM/DD")) {
      return false;
    }
    var digits = tin.split("").map(function(a) {
      return parseInt(a, 10);
    });
    var checksum = 0;
    var weight = 4;
    for (var i = 0; i < 9; i++) {
      checksum += digits[i] * weight;
      weight -= 1;
      if (weight === 1) {
        weight = 7;
      }
    }
    checksum %= 11;
    if (checksum === 1) {
      return false;
    }
    return checksum === 0 ? digits[9] === 0 : digits[9] === 11 - checksum;
  }
  function elCyCheck(tin) {
    var digits = tin.slice(0, 8).split("").map(function(a) {
      return parseInt(a, 10);
    });
    var checksum = 0;
    for (var i = 1; i < digits.length; i += 2) {
      checksum += digits[i];
    }
    for (var _i2 = 0; _i2 < digits.length; _i2 += 2) {
      if (digits[_i2] < 2) {
        checksum += 1 - digits[_i2];
      } else {
        checksum += 2 * (digits[_i2] - 2) + 5;
        if (digits[_i2] > 4) {
          checksum += 2;
        }
      }
    }
    return String.fromCharCode(checksum % 26 + 65) === tin.charAt(8);
  }
  function elGrCheck(tin) {
    var digits = tin.split("").map(function(a) {
      return parseInt(a, 10);
    });
    var checksum = 0;
    for (var i = 0; i < 8; i++) {
      checksum += digits[i] * Math.pow(2, 8 - i);
    }
    return checksum % 11 % 10 === digits[8];
  }
  function enIeCheck(tin) {
    var checksum = algorithms2.reverseMultiplyAndSum(tin.split("").slice(0, 7).map(function(a) {
      return parseInt(a, 10);
    }), 8);
    if (tin.length === 9 && tin[8] !== "W") {
      checksum += (tin[8].charCodeAt(0) - 64) * 9;
    }
    checksum %= 23;
    if (checksum === 0) {
      return tin[7].toUpperCase() === "W";
    }
    return tin[7].toUpperCase() === String.fromCharCode(64 + checksum);
  }
  var enUsCampusPrefix = {
    andover: ["10", "12"],
    atlanta: ["60", "67"],
    austin: ["50", "53"],
    brookhaven: ["01", "02", "03", "04", "05", "06", "11", "13", "14", "16", "21", "22", "23", "25", "34", "51", "52", "54", "55", "56", "57", "58", "59", "65"],
    cincinnati: ["30", "32", "35", "36", "37", "38", "61"],
    fresno: ["15", "24"],
    internet: ["20", "26", "27", "45", "46", "47"],
    kansas: ["40", "44"],
    memphis: ["94", "95"],
    ogden: ["80", "90"],
    philadelphia: ["33", "39", "41", "42", "43", "46", "48", "62", "63", "64", "66", "68", "71", "72", "73", "74", "75", "76", "77", "81", "82", "83", "84", "85", "86", "87", "88", "91", "92", "93", "98", "99"],
    sba: ["31"]
  };
  function enUsGetPrefixes() {
    var prefixes2 = [];
    for (var location in enUsCampusPrefix) {
      if (enUsCampusPrefix.hasOwnProperty(location)) {
        prefixes2.push.apply(prefixes2, _toConsumableArray(enUsCampusPrefix[location]));
      }
    }
    return prefixes2;
  }
  function enUsCheck(tin) {
    return enUsGetPrefixes().indexOf(tin.slice(0, 2)) !== -1;
  }
  function esEsCheck(tin) {
    var chars = tin.toUpperCase().split("");
    if (isNaN(parseInt(chars[0], 10)) && chars.length > 1) {
      var lead_replace = 0;
      switch (chars[0]) {
        case "Y":
          lead_replace = 1;
          break;
        case "Z":
          lead_replace = 2;
          break;
      }
      chars.splice(0, 1, lead_replace);
    } else {
      while (chars.length < 9) {
        chars.unshift(0);
      }
    }
    var lookup = ["T", "R", "W", "A", "G", "M", "Y", "F", "P", "D", "X", "B", "N", "J", "Z", "S", "Q", "V", "H", "L", "C", "K", "E"];
    chars = chars.join("");
    var checksum = parseInt(chars.slice(0, 8), 10) % 23;
    return chars[8] === lookup[checksum];
  }
  function etEeCheck(tin) {
    var full_year = tin.slice(1, 3);
    var century_digit = tin.slice(0, 1);
    switch (century_digit) {
      case "1":
      case "2":
        full_year = "18".concat(full_year);
        break;
      case "3":
      case "4":
        full_year = "19".concat(full_year);
        break;
      default:
        full_year = "20".concat(full_year);
        break;
    }
    var date = "".concat(full_year, "/").concat(tin.slice(3, 5), "/").concat(tin.slice(5, 7));
    if (!(0, _isDate.default)(date, "YYYY/MM/DD")) {
      return false;
    }
    var digits = tin.split("").map(function(a) {
      return parseInt(a, 10);
    });
    var checksum = 0;
    var weight = 1;
    for (var i = 0; i < 10; i++) {
      checksum += digits[i] * weight;
      weight += 1;
      if (weight === 10) {
        weight = 1;
      }
    }
    if (checksum % 11 === 10) {
      checksum = 0;
      weight = 3;
      for (var _i3 = 0; _i3 < 10; _i3++) {
        checksum += digits[_i3] * weight;
        weight += 1;
        if (weight === 10) {
          weight = 1;
        }
      }
      if (checksum % 11 === 10) {
        return digits[10] === 0;
      }
    }
    return checksum % 11 === digits[10];
  }
  function fiFiCheck(tin) {
    var full_year = tin.slice(4, 6);
    var century_symbol = tin.slice(6, 7);
    switch (century_symbol) {
      case "+":
        full_year = "18".concat(full_year);
        break;
      case "-":
        full_year = "19".concat(full_year);
        break;
      default:
        full_year = "20".concat(full_year);
        break;
    }
    var date = "".concat(full_year, "/").concat(tin.slice(2, 4), "/").concat(tin.slice(0, 2));
    if (!(0, _isDate.default)(date, "YYYY/MM/DD")) {
      return false;
    }
    var checksum = parseInt(tin.slice(0, 6) + tin.slice(7, 10), 10) % 31;
    if (checksum < 10) {
      return checksum === parseInt(tin.slice(10), 10);
    }
    checksum -= 10;
    var letters_lookup = ["A", "B", "C", "D", "E", "F", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "U", "V", "W", "X", "Y"];
    return letters_lookup[checksum] === tin.slice(10);
  }
  function frBeCheck(tin) {
    if (tin.slice(2, 4) !== "00" || tin.slice(4, 6) !== "00") {
      var date = "".concat(tin.slice(0, 2), "/").concat(tin.slice(2, 4), "/").concat(tin.slice(4, 6));
      if (!(0, _isDate.default)(date, "YY/MM/DD")) {
        return false;
      }
    }
    var checksum = 97 - parseInt(tin.slice(0, 9), 10) % 97;
    var checkdigits = parseInt(tin.slice(9, 11), 10);
    if (checksum !== checkdigits) {
      checksum = 97 - parseInt("2".concat(tin.slice(0, 9)), 10) % 97;
      if (checksum !== checkdigits) {
        return false;
      }
    }
    return true;
  }
  function frFrCheck(tin) {
    tin = tin.replace(/\s/g, "");
    var checksum = parseInt(tin.slice(0, 10), 10) % 511;
    var checkdigits = parseInt(tin.slice(10, 13), 10);
    return checksum === checkdigits;
  }
  function frLuCheck(tin) {
    var date = "".concat(tin.slice(0, 4), "/").concat(tin.slice(4, 6), "/").concat(tin.slice(6, 8));
    if (!(0, _isDate.default)(date, "YYYY/MM/DD")) {
      return false;
    }
    if (!algorithms2.luhnCheck(tin.slice(0, 12))) {
      return false;
    }
    return algorithms2.verhoeffCheck("".concat(tin.slice(0, 11)).concat(tin[12]));
  }
  function hrHrCheck(tin) {
    return algorithms2.iso7064Check(tin);
  }
  function huHuCheck(tin) {
    var digits = tin.split("").map(function(a) {
      return parseInt(a, 10);
    });
    var checksum = 8;
    for (var i = 1; i < 9; i++) {
      checksum += digits[i] * (i + 1);
    }
    return checksum % 11 === digits[9];
  }
  function itItNameCheck(name) {
    var vowelflag = false;
    var xflag = false;
    for (var i = 0; i < 3; i++) {
      if (!vowelflag && /[AEIOU]/.test(name[i])) {
        vowelflag = true;
      } else if (!xflag && vowelflag && name[i] === "X") {
        xflag = true;
      } else if (i > 0) {
        if (vowelflag && !xflag) {
          if (!/[AEIOU]/.test(name[i])) {
            return false;
          }
        }
        if (xflag) {
          if (!/X/.test(name[i])) {
            return false;
          }
        }
      }
    }
    return true;
  }
  function itItCheck(tin) {
    var chars = tin.toUpperCase().split("");
    if (!itItNameCheck(chars.slice(0, 3))) {
      return false;
    }
    if (!itItNameCheck(chars.slice(3, 6))) {
      return false;
    }
    var number_locations = [6, 7, 9, 10, 12, 13, 14];
    var number_replace = {
      L: "0",
      M: "1",
      N: "2",
      P: "3",
      Q: "4",
      R: "5",
      S: "6",
      T: "7",
      U: "8",
      V: "9"
    };
    for (var _i4 = 0, _number_locations = number_locations; _i4 < _number_locations.length; _i4++) {
      var i = _number_locations[_i4];
      if (chars[i] in number_replace) {
        chars.splice(i, 1, number_replace[chars[i]]);
      }
    }
    var month_replace = {
      A: "01",
      B: "02",
      C: "03",
      D: "04",
      E: "05",
      H: "06",
      L: "07",
      M: "08",
      P: "09",
      R: "10",
      S: "11",
      T: "12"
    };
    var month = month_replace[chars[8]];
    var day = parseInt(chars[9] + chars[10], 10);
    if (day > 40) {
      day -= 40;
    }
    if (day < 10) {
      day = "0".concat(day);
    }
    var date = "".concat(chars[6]).concat(chars[7], "/").concat(month, "/").concat(day);
    if (!(0, _isDate.default)(date, "YY/MM/DD")) {
      return false;
    }
    var checksum = 0;
    for (var _i5 = 1; _i5 < chars.length - 1; _i5 += 2) {
      var char_to_int = parseInt(chars[_i5], 10);
      if (isNaN(char_to_int)) {
        char_to_int = chars[_i5].charCodeAt(0) - 65;
      }
      checksum += char_to_int;
    }
    var odd_convert = {
      // Maps of characters at odd places
      A: 1,
      B: 0,
      C: 5,
      D: 7,
      E: 9,
      F: 13,
      G: 15,
      H: 17,
      I: 19,
      J: 21,
      K: 2,
      L: 4,
      M: 18,
      N: 20,
      O: 11,
      P: 3,
      Q: 6,
      R: 8,
      S: 12,
      T: 14,
      U: 16,
      V: 10,
      W: 22,
      X: 25,
      Y: 24,
      Z: 23,
      0: 1,
      1: 0
    };
    for (var _i6 = 0; _i6 < chars.length - 1; _i6 += 2) {
      var _char_to_int = 0;
      if (chars[_i6] in odd_convert) {
        _char_to_int = odd_convert[chars[_i6]];
      } else {
        var multiplier = parseInt(chars[_i6], 10);
        _char_to_int = 2 * multiplier + 1;
        if (multiplier > 4) {
          _char_to_int += 2;
        }
      }
      checksum += _char_to_int;
    }
    if (String.fromCharCode(65 + checksum % 26) !== chars[15]) {
      return false;
    }
    return true;
  }
  function lvLvCheck(tin) {
    tin = tin.replace(/\W/, "");
    var day = tin.slice(0, 2);
    if (day !== "32") {
      var month = tin.slice(2, 4);
      if (month !== "00") {
        var full_year = tin.slice(4, 6);
        switch (tin[6]) {
          case "0":
            full_year = "18".concat(full_year);
            break;
          case "1":
            full_year = "19".concat(full_year);
            break;
          default:
            full_year = "20".concat(full_year);
            break;
        }
        var date = "".concat(full_year, "/").concat(tin.slice(2, 4), "/").concat(day);
        if (!(0, _isDate.default)(date, "YYYY/MM/DD")) {
          return false;
        }
      }
      var checksum = 1101;
      var multip_lookup = [1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      for (var i = 0; i < tin.length - 1; i++) {
        checksum -= parseInt(tin[i], 10) * multip_lookup[i];
      }
      return parseInt(tin[10], 10) === checksum % 11;
    }
    return true;
  }
  function mtMtCheck(tin) {
    if (tin.length !== 9) {
      var chars = tin.toUpperCase().split("");
      while (chars.length < 8) {
        chars.unshift(0);
      }
      switch (tin[7]) {
        case "A":
        case "P":
          if (parseInt(chars[6], 10) === 0) {
            return false;
          }
          break;
        default: {
          var first_part = parseInt(chars.join("").slice(0, 5), 10);
          if (first_part > 32e3) {
            return false;
          }
          var second_part = parseInt(chars.join("").slice(5, 7), 10);
          if (first_part === second_part) {
            return false;
          }
        }
      }
    }
    return true;
  }
  function nlNlCheck(tin) {
    return algorithms2.reverseMultiplyAndSum(tin.split("").slice(0, 8).map(function(a) {
      return parseInt(a, 10);
    }), 9) % 11 === parseInt(tin[8], 10);
  }
  function plPlCheck(tin) {
    if (tin.length === 10) {
      var lookup = [6, 5, 7, 2, 3, 4, 5, 6, 7];
      var _checksum = 0;
      for (var i = 0; i < lookup.length; i++) {
        _checksum += parseInt(tin[i], 10) * lookup[i];
      }
      _checksum %= 11;
      if (_checksum === 10) {
        return false;
      }
      return _checksum === parseInt(tin[9], 10);
    }
    var full_year = tin.slice(0, 2);
    var month = parseInt(tin.slice(2, 4), 10);
    if (month > 80) {
      full_year = "18".concat(full_year);
      month -= 80;
    } else if (month > 60) {
      full_year = "22".concat(full_year);
      month -= 60;
    } else if (month > 40) {
      full_year = "21".concat(full_year);
      month -= 40;
    } else if (month > 20) {
      full_year = "20".concat(full_year);
      month -= 20;
    } else {
      full_year = "19".concat(full_year);
    }
    if (month < 10) {
      month = "0".concat(month);
    }
    var date = "".concat(full_year, "/").concat(month, "/").concat(tin.slice(4, 6));
    if (!(0, _isDate.default)(date, "YYYY/MM/DD")) {
      return false;
    }
    var checksum = 0;
    var multiplier = 1;
    for (var _i7 = 0; _i7 < tin.length - 1; _i7++) {
      checksum += parseInt(tin[_i7], 10) * multiplier % 10;
      multiplier += 2;
      if (multiplier > 10) {
        multiplier = 1;
      } else if (multiplier === 5) {
        multiplier += 2;
      }
    }
    checksum = 10 - checksum % 10;
    return checksum === parseInt(tin[10], 10);
  }
  function ptBrCheck(tin) {
    if (tin.length === 11) {
      var _sum;
      var remainder;
      _sum = 0;
      if (
        // Reject known invalid CPFs
        tin === "11111111111" || tin === "22222222222" || tin === "33333333333" || tin === "44444444444" || tin === "55555555555" || tin === "66666666666" || tin === "77777777777" || tin === "88888888888" || tin === "99999999999" || tin === "00000000000"
      )
        return false;
      for (var i = 1; i <= 9; i++) {
        _sum += parseInt(tin.substring(i - 1, i), 10) * (11 - i);
      }
      remainder = _sum * 10 % 11;
      if (remainder === 10)
        remainder = 0;
      if (remainder !== parseInt(tin.substring(9, 10), 10))
        return false;
      _sum = 0;
      for (var _i8 = 1; _i8 <= 10; _i8++) {
        _sum += parseInt(tin.substring(_i8 - 1, _i8), 10) * (12 - _i8);
      }
      remainder = _sum * 10 % 11;
      if (remainder === 10)
        remainder = 0;
      if (remainder !== parseInt(tin.substring(10, 11), 10))
        return false;
      return true;
    }
    if (
      // Reject know invalid CNPJs
      tin === "00000000000000" || tin === "11111111111111" || tin === "22222222222222" || tin === "33333333333333" || tin === "44444444444444" || tin === "55555555555555" || tin === "66666666666666" || tin === "77777777777777" || tin === "88888888888888" || tin === "99999999999999"
    ) {
      return false;
    }
    var length = tin.length - 2;
    var identifiers = tin.substring(0, length);
    var verificators = tin.substring(length);
    var sum = 0;
    var pos = length - 7;
    for (var _i9 = length; _i9 >= 1; _i9--) {
      sum += identifiers.charAt(length - _i9) * pos;
      pos -= 1;
      if (pos < 2) {
        pos = 9;
      }
    }
    var result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(verificators.charAt(0), 10)) {
      return false;
    }
    length += 1;
    identifiers = tin.substring(0, length);
    sum = 0;
    pos = length - 7;
    for (var _i10 = length; _i10 >= 1; _i10--) {
      sum += identifiers.charAt(length - _i10) * pos;
      pos -= 1;
      if (pos < 2) {
        pos = 9;
      }
    }
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(verificators.charAt(1), 10)) {
      return false;
    }
    return true;
  }
  function ptPtCheck(tin) {
    var checksum = 11 - algorithms2.reverseMultiplyAndSum(tin.split("").slice(0, 8).map(function(a) {
      return parseInt(a, 10);
    }), 9) % 11;
    if (checksum > 9) {
      return parseInt(tin[8], 10) === 0;
    }
    return checksum === parseInt(tin[8], 10);
  }
  function roRoCheck(tin) {
    if (tin.slice(0, 4) !== "9000") {
      var full_year = tin.slice(1, 3);
      switch (tin[0]) {
        case "1":
        case "2":
          full_year = "19".concat(full_year);
          break;
        case "3":
        case "4":
          full_year = "18".concat(full_year);
          break;
        case "5":
        case "6":
          full_year = "20".concat(full_year);
          break;
      }
      var date = "".concat(full_year, "/").concat(tin.slice(3, 5), "/").concat(tin.slice(5, 7));
      if (date.length === 8) {
        if (!(0, _isDate.default)(date, "YY/MM/DD")) {
          return false;
        }
      } else if (!(0, _isDate.default)(date, "YYYY/MM/DD")) {
        return false;
      }
      var digits = tin.split("").map(function(a) {
        return parseInt(a, 10);
      });
      var multipliers = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
      var checksum = 0;
      for (var i = 0; i < multipliers.length; i++) {
        checksum += digits[i] * multipliers[i];
      }
      if (checksum % 11 === 10) {
        return digits[12] === 1;
      }
      return digits[12] === checksum % 11;
    }
    return true;
  }
  function skSkCheck(tin) {
    if (tin.length === 9) {
      tin = tin.replace(/\W/, "");
      if (tin.slice(6) === "000") {
        return false;
      }
      var full_year = parseInt(tin.slice(0, 2), 10);
      if (full_year > 53) {
        return false;
      }
      if (full_year < 10) {
        full_year = "190".concat(full_year);
      } else {
        full_year = "19".concat(full_year);
      }
      var month = parseInt(tin.slice(2, 4), 10);
      if (month > 50) {
        month -= 50;
      }
      if (month < 10) {
        month = "0".concat(month);
      }
      var date = "".concat(full_year, "/").concat(month, "/").concat(tin.slice(4, 6));
      if (!(0, _isDate.default)(date, "YYYY/MM/DD")) {
        return false;
      }
    }
    return true;
  }
  function slSiCheck(tin) {
    var checksum = 11 - algorithms2.reverseMultiplyAndSum(tin.split("").slice(0, 7).map(function(a) {
      return parseInt(a, 10);
    }), 8) % 11;
    if (checksum === 10) {
      return parseInt(tin[7], 10) === 0;
    }
    return checksum === parseInt(tin[7], 10);
  }
  function svSeCheck(tin) {
    var tin_copy = tin.slice(0);
    if (tin.length > 11) {
      tin_copy = tin_copy.slice(2);
    }
    var full_year = "";
    var month = tin_copy.slice(2, 4);
    var day = parseInt(tin_copy.slice(4, 6), 10);
    if (tin.length > 11) {
      full_year = tin.slice(0, 4);
    } else {
      full_year = tin.slice(0, 2);
      if (tin.length === 11 && day < 60) {
        var current_year = new Date().getFullYear().toString();
        var current_century = parseInt(current_year.slice(0, 2), 10);
        current_year = parseInt(current_year, 10);
        if (tin[6] === "-") {
          if (parseInt("".concat(current_century).concat(full_year), 10) > current_year) {
            full_year = "".concat(current_century - 1).concat(full_year);
          } else {
            full_year = "".concat(current_century).concat(full_year);
          }
        } else {
          full_year = "".concat(current_century - 1).concat(full_year);
          if (current_year - parseInt(full_year, 10) < 100) {
            return false;
          }
        }
      }
    }
    if (day > 60) {
      day -= 60;
    }
    if (day < 10) {
      day = "0".concat(day);
    }
    var date = "".concat(full_year, "/").concat(month, "/").concat(day);
    if (date.length === 8) {
      if (!(0, _isDate.default)(date, "YY/MM/DD")) {
        return false;
      }
    } else if (!(0, _isDate.default)(date, "YYYY/MM/DD")) {
      return false;
    }
    return algorithms2.luhnCheck(tin.replace(/\W/, ""));
  }
  var taxIdFormat = {
    "bg-BG": /^\d{10}$/,
    "cs-CZ": /^\d{6}\/{0,1}\d{3,4}$/,
    "de-AT": /^\d{9}$/,
    "de-DE": /^[1-9]\d{10}$/,
    "dk-DK": /^\d{6}-{0,1}\d{4}$/,
    "el-CY": /^[09]\d{7}[A-Z]$/,
    "el-GR": /^([0-4]|[7-9])\d{8}$/,
    "en-CA": /^\d{9}$/,
    "en-GB": /^\d{10}$|^(?!GB|NK|TN|ZZ)(?![DFIQUV])[A-Z](?![DFIQUVO])[A-Z]\d{6}[ABCD ]$/i,
    "en-IE": /^\d{7}[A-W][A-IW]{0,1}$/i,
    "en-US": /^\d{2}[- ]{0,1}\d{7}$/,
    "es-ES": /^(\d{0,8}|[XYZKLM]\d{7})[A-HJ-NP-TV-Z]$/i,
    "et-EE": /^[1-6]\d{6}(00[1-9]|0[1-9][0-9]|[1-6][0-9]{2}|70[0-9]|710)\d$/,
    "fi-FI": /^\d{6}[-+A]\d{3}[0-9A-FHJ-NPR-Y]$/i,
    "fr-BE": /^\d{11}$/,
    "fr-FR": /^[0-3]\d{12}$|^[0-3]\d\s\d{2}(\s\d{3}){3}$/,
    // Conforms both to official spec and provided example
    "fr-LU": /^\d{13}$/,
    "hr-HR": /^\d{11}$/,
    "hu-HU": /^8\d{9}$/,
    "it-IT": /^[A-Z]{6}[L-NP-V0-9]{2}[A-EHLMPRST][L-NP-V0-9]{2}[A-ILMZ][L-NP-V0-9]{3}[A-Z]$/i,
    "lv-LV": /^\d{6}-{0,1}\d{5}$/,
    // Conforms both to DG TAXUD spec and original research
    "mt-MT": /^\d{3,7}[APMGLHBZ]$|^([1-8])\1\d{7}$/i,
    "nl-NL": /^\d{9}$/,
    "pl-PL": /^\d{10,11}$/,
    "pt-BR": /(?:^\d{11}$)|(?:^\d{14}$)/,
    "pt-PT": /^\d{9}$/,
    "ro-RO": /^\d{13}$/,
    "sk-SK": /^\d{6}\/{0,1}\d{3,4}$/,
    "sl-SI": /^[1-9]\d{7}$/,
    "sv-SE": /^(\d{6}[-+]{0,1}\d{4}|(18|19|20)\d{6}[-+]{0,1}\d{4})$/
  };
  taxIdFormat["lb-LU"] = taxIdFormat["fr-LU"];
  taxIdFormat["lt-LT"] = taxIdFormat["et-EE"];
  taxIdFormat["nl-BE"] = taxIdFormat["fr-BE"];
  taxIdFormat["fr-CA"] = taxIdFormat["en-CA"];
  var taxIdCheck = {
    "bg-BG": bgBgCheck,
    "cs-CZ": csCzCheck,
    "de-AT": deAtCheck,
    "de-DE": deDeCheck,
    "dk-DK": dkDkCheck,
    "el-CY": elCyCheck,
    "el-GR": elGrCheck,
    "en-CA": isCanadianSIN,
    "en-IE": enIeCheck,
    "en-US": enUsCheck,
    "es-ES": esEsCheck,
    "et-EE": etEeCheck,
    "fi-FI": fiFiCheck,
    "fr-BE": frBeCheck,
    "fr-FR": frFrCheck,
    "fr-LU": frLuCheck,
    "hr-HR": hrHrCheck,
    "hu-HU": huHuCheck,
    "it-IT": itItCheck,
    "lv-LV": lvLvCheck,
    "mt-MT": mtMtCheck,
    "nl-NL": nlNlCheck,
    "pl-PL": plPlCheck,
    "pt-BR": ptBrCheck,
    "pt-PT": ptPtCheck,
    "ro-RO": roRoCheck,
    "sk-SK": skSkCheck,
    "sl-SI": slSiCheck,
    "sv-SE": svSeCheck
  };
  taxIdCheck["lb-LU"] = taxIdCheck["fr-LU"];
  taxIdCheck["lt-LT"] = taxIdCheck["et-EE"];
  taxIdCheck["nl-BE"] = taxIdCheck["fr-BE"];
  taxIdCheck["fr-CA"] = taxIdCheck["en-CA"];
  var allsymbols = /[-\\\/!@#$%\^&\*\(\)\+\=\[\]]+/g;
  var sanitizeRegexes = {
    "de-AT": allsymbols,
    "de-DE": /[\/\\]/g,
    "fr-BE": allsymbols
  };
  sanitizeRegexes["nl-BE"] = sanitizeRegexes["fr-BE"];
  function isTaxID2(str) {
    var locale = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "en-US";
    (0, _assertString2.default)(str);
    var strcopy = str.slice(0);
    if (locale in taxIdFormat) {
      if (locale in sanitizeRegexes) {
        strcopy = strcopy.replace(sanitizeRegexes[locale], "");
      }
      if (!taxIdFormat[locale].test(strcopy)) {
        return false;
      }
      if (locale in taxIdCheck) {
        return taxIdCheck[locale](strcopy);
      }
      return true;
    }
    throw new Error("Invalid locale '".concat(locale, "'"));
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isTaxID, isTaxIDExports);
var isMobilePhone$1 = {};
Object.defineProperty(isMobilePhone$1, "__esModule", {
  value: true
});
isMobilePhone$1.default = isMobilePhone;
isMobilePhone$1.locales = void 0;
var _assertString$3 = _interopRequireDefault$3(assertStringExports);
function _interopRequireDefault$3(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
var phones = {
  "am-AM": /^(\+?374|0)((10|[9|7][0-9])\d{6}$|[2-4]\d{7}$)/,
  "ar-AE": /^((\+?971)|0)?5[024568]\d{7}$/,
  "ar-BH": /^(\+?973)?(3|6)\d{7}$/,
  "ar-DZ": /^(\+?213|0)(5|6|7)\d{8}$/,
  "ar-LB": /^(\+?961)?((3|81)\d{6}|7\d{7})$/,
  "ar-EG": /^((\+?20)|0)?1[0125]\d{8}$/,
  "ar-IQ": /^(\+?964|0)?7[0-9]\d{8}$/,
  "ar-JO": /^(\+?962|0)?7[789]\d{7}$/,
  "ar-KW": /^(\+?965)([569]\d{7}|41\d{6})$/,
  "ar-LY": /^((\+?218)|0)?(9[1-6]\d{7}|[1-8]\d{7,9})$/,
  "ar-MA": /^(?:(?:\+|00)212|0)[5-7]\d{8}$/,
  "ar-OM": /^((\+|00)968)?(9[1-9])\d{6}$/,
  "ar-PS": /^(\+?970|0)5[6|9](\d{7})$/,
  "ar-SA": /^(!?(\+?966)|0)?5\d{8}$/,
  "ar-SY": /^(!?(\+?963)|0)?9\d{8}$/,
  "ar-TN": /^(\+?216)?[2459]\d{7}$/,
  "az-AZ": /^(\+994|0)(10|5[015]|7[07]|99)\d{7}$/,
  "bs-BA": /^((((\+|00)3876)|06))((([0-3]|[5-6])\d{6})|(4\d{7}))$/,
  "be-BY": /^(\+?375)?(24|25|29|33|44)\d{7}$/,
  "bg-BG": /^(\+?359|0)?8[789]\d{7}$/,
  "bn-BD": /^(\+?880|0)1[13456789][0-9]{8}$/,
  "ca-AD": /^(\+376)?[346]\d{5}$/,
  "cs-CZ": /^(\+?420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
  "da-DK": /^(\+?45)?\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/,
  "de-DE": /^((\+49|0)1)(5[0-25-9]\d|6([23]|0\d?)|7([0-57-9]|6\d))\d{7,9}$/,
  "de-AT": /^(\+43|0)\d{1,4}\d{3,12}$/,
  "de-CH": /^(\+41|0)([1-9])\d{1,9}$/,
  "de-LU": /^(\+352)?((6\d1)\d{6})$/,
  "dv-MV": /^(\+?960)?(7[2-9]|9[1-9])\d{5}$/,
  "el-GR": /^(\+?30|0)?6(8[5-9]|9(?![26])[0-9])\d{7}$/,
  "el-CY": /^(\+?357?)?(9(9|6)\d{6})$/,
  "en-AI": /^(\+?1|0)264(?:2(35|92)|4(?:6[1-2]|76|97)|5(?:3[6-9]|8[1-4])|7(?:2(4|9)|72))\d{4}$/,
  "en-AU": /^(\+?61|0)4\d{8}$/,
  "en-AG": /^(?:\+1|1)268(?:464|7(?:1[3-9]|[28]\d|3[0246]|64|7[0-689]))\d{4}$/,
  "en-BM": /^(\+?1)?441(((3|7)\d{6}$)|(5[0-3][0-9]\d{4}$)|(59\d{5}$))/,
  "en-BS": /^(\+?1[-\s]?|0)?\(?242\)?[-\s]?\d{3}[-\s]?\d{4}$/,
  "en-GB": /^(\+?44|0)7\d{9}$/,
  "en-GG": /^(\+?44|0)1481\d{6}$/,
  "en-GH": /^(\+233|0)(20|50|24|54|27|57|26|56|23|28|55|59)\d{7}$/,
  "en-GY": /^(\+592|0)6\d{6}$/,
  "en-HK": /^(\+?852[-\s]?)?[456789]\d{3}[-\s]?\d{4}$/,
  "en-MO": /^(\+?853[-\s]?)?[6]\d{3}[-\s]?\d{4}$/,
  "en-IE": /^(\+?353|0)8[356789]\d{7}$/,
  "en-IN": /^(\+?91|0)?[6789]\d{9}$/,
  "en-JM": /^(\+?876)?\d{7}$/,
  "en-KE": /^(\+?254|0)(7|1)\d{8}$/,
  "en-SS": /^(\+?211|0)(9[1257])\d{7}$/,
  "en-KI": /^((\+686|686)?)?( )?((6|7)(2|3|8)[0-9]{6})$/,
  "en-KN": /^(?:\+1|1)869(?:46\d|48[89]|55[6-8]|66\d|76[02-7])\d{4}$/,
  "en-LS": /^(\+?266)(22|28|57|58|59|27|52)\d{6}$/,
  "en-MT": /^(\+?356|0)?(99|79|77|21|27|22|25)[0-9]{6}$/,
  "en-MU": /^(\+?230|0)?\d{8}$/,
  "en-NA": /^(\+?264|0)(6|8)\d{7}$/,
  "en-NG": /^(\+?234|0)?[789]\d{9}$/,
  "en-NZ": /^(\+?64|0)[28]\d{7,9}$/,
  "en-PG": /^(\+?675|0)?(7\d|8[18])\d{6}$/,
  "en-PK": /^((00|\+)?92|0)3[0-6]\d{8}$/,
  "en-PH": /^(09|\+639)\d{9}$/,
  "en-RW": /^(\+?250|0)?[7]\d{8}$/,
  "en-SG": /^(\+65)?[3689]\d{7}$/,
  "en-SL": /^(\+?232|0)\d{8}$/,
  "en-TZ": /^(\+?255|0)?[67]\d{8}$/,
  "en-UG": /^(\+?256|0)?[7]\d{8}$/,
  "en-US": /^((\+1|1)?( |-)?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$/,
  "en-ZA": /^(\+?27|0)\d{9}$/,
  "en-ZM": /^(\+?26)?09[567]\d{7}$/,
  "en-ZW": /^(\+263)[0-9]{9}$/,
  "en-BW": /^(\+?267)?(7[1-8]{1})\d{6}$/,
  "es-AR": /^\+?549(11|[2368]\d)\d{8}$/,
  "es-BO": /^(\+?591)?(6|7)\d{7}$/,
  "es-CO": /^(\+?57)?3(0(0|1|2|4|5)|1\d|2[0-4]|5(0|1))\d{7}$/,
  "es-CL": /^(\+?56|0)[2-9]\d{1}\d{7}$/,
  "es-CR": /^(\+506)?[2-8]\d{7}$/,
  "es-CU": /^(\+53|0053)?5\d{7}/,
  "es-DO": /^(\+?1)?8[024]9\d{7}$/,
  "es-HN": /^(\+?504)?[9|8|3|2]\d{7}$/,
  "es-EC": /^(\+?593|0)([2-7]|9[2-9])\d{7}$/,
  "es-ES": /^(\+?34)?[6|7]\d{8}$/,
  "es-PE": /^(\+?51)?9\d{8}$/,
  "es-MX": /^(\+?52)?(1|01)?\d{10,11}$/,
  "es-NI": /^(\+?505)\d{7,8}$/,
  "es-PA": /^(\+?507)\d{7,8}$/,
  "es-PY": /^(\+?595|0)9[9876]\d{7}$/,
  "es-SV": /^(\+?503)?[67]\d{7}$/,
  "es-UY": /^(\+598|0)9[1-9][\d]{6}$/,
  "es-VE": /^(\+?58)?(2|4)\d{9}$/,
  "et-EE": /^(\+?372)?\s?(5|8[1-4])\s?([0-9]\s?){6,7}$/,
  "fa-IR": /^(\+?98[\-\s]?|0)9[0-39]\d[\-\s]?\d{3}[\-\s]?\d{4}$/,
  "fi-FI": /^(\+?358|0)\s?(4[0-6]|50)\s?(\d\s?){4,8}$/,
  "fj-FJ": /^(\+?679)?\s?\d{3}\s?\d{4}$/,
  "fo-FO": /^(\+?298)?\s?\d{2}\s?\d{2}\s?\d{2}$/,
  "fr-BF": /^(\+226|0)[67]\d{7}$/,
  "fr-BJ": /^(\+229)\d{8}$/,
  "fr-CD": /^(\+?243|0)?(8|9)\d{8}$/,
  "fr-CM": /^(\+?237)6[0-9]{8}$/,
  "fr-FR": /^(\+?33|0)[67]\d{8}$/,
  "fr-GF": /^(\+?594|0|00594)[67]\d{8}$/,
  "fr-GP": /^(\+?590|0|00590)[67]\d{8}$/,
  "fr-MQ": /^(\+?596|0|00596)[67]\d{8}$/,
  "fr-PF": /^(\+?689)?8[789]\d{6}$/,
  "fr-RE": /^(\+?262|0|00262)[67]\d{8}$/,
  "he-IL": /^(\+972|0)([23489]|5[012345689]|77)[1-9]\d{6}$/,
  "hu-HU": /^(\+?36|06)(20|30|31|50|70)\d{7}$/,
  "id-ID": /^(\+?62|0)8(1[123456789]|2[1238]|3[1238]|5[12356789]|7[78]|9[56789]|8[123456789])([\s?|\d]{5,11})$/,
  "ir-IR": /^(\+98|0)?9\d{9}$/,
  "it-IT": /^(\+?39)?\s?3\d{2} ?\d{6,7}$/,
  "it-SM": /^((\+378)|(0549)|(\+390549)|(\+3780549))?6\d{5,9}$/,
  "ja-JP": /^(\+81[ \-]?(\(0\))?|0)[6789]0[ \-]?\d{4}[ \-]?\d{4}$/,
  "ka-GE": /^(\+?995)?(79\d{7}|5\d{8})$/,
  "kk-KZ": /^(\+?7|8)?7\d{9}$/,
  "kl-GL": /^(\+?299)?\s?\d{2}\s?\d{2}\s?\d{2}$/,
  "ko-KR": /^((\+?82)[ \-]?)?0?1([0|1|6|7|8|9]{1})[ \-]?\d{3,4}[ \-]?\d{4}$/,
  "ky-KG": /^(\+?7\s?\+?7|0)\s?\d{2}\s?\d{3}\s?\d{4}$/,
  "lt-LT": /^(\+370|8)\d{8}$/,
  "lv-LV": /^(\+?371)2\d{7}$/,
  "mg-MG": /^((\+?261|0)(2|3)\d)?\d{7}$/,
  "mn-MN": /^(\+|00|011)?976(77|81|88|91|94|95|96|99)\d{6}$/,
  "my-MM": /^(\+?959|09|9)(2[5-7]|3[1-2]|4[0-5]|6[6-9]|7[5-9]|9[6-9])[0-9]{7}$/,
  "ms-MY": /^(\+?60|0)1(([0145](-|\s)?\d{7,8})|([236-9](-|\s)?\d{7}))$/,
  "mz-MZ": /^(\+?258)?8[234567]\d{7}$/,
  "nb-NO": /^(\+?47)?[49]\d{7}$/,
  "ne-NP": /^(\+?977)?9[78]\d{8}$/,
  "nl-BE": /^(\+?32|0)4\d{8}$/,
  "nl-NL": /^(((\+|00)?31\(0\))|((\+|00)?31)|0)6{1}\d{8}$/,
  "nl-AW": /^(\+)?297(56|59|64|73|74|99)\d{5}$/,
  "nn-NO": /^(\+?47)?[49]\d{7}$/,
  "pl-PL": /^(\+?48)? ?[5-8]\d ?\d{3} ?\d{2} ?\d{2}$/,
  "pt-BR": /^((\+?55\ ?[1-9]{2}\ ?)|(\+?55\ ?\([1-9]{2}\)\ ?)|(0[1-9]{2}\ ?)|(\([1-9]{2}\)\ ?)|([1-9]{2}\ ?))((\d{4}\-?\d{4})|(9[1-9]{1}\d{3}\-?\d{4}))$/,
  "pt-PT": /^(\+?351)?9[1236]\d{7}$/,
  "pt-AO": /^(\+244)\d{9}$/,
  "ro-MD": /^(\+?373|0)((6(0|1|2|6|7|8|9))|(7(6|7|8|9)))\d{6}$/,
  "ro-RO": /^(\+?40|0)\s?7\d{2}(\/|\s|\.|-)?\d{3}(\s|\.|-)?\d{3}$/,
  "ru-RU": /^(\+?7|8)?9\d{9}$/,
  "si-LK": /^(?:0|94|\+94)?(7(0|1|2|4|5|6|7|8)( |-)?)\d{7}$/,
  "sl-SI": /^(\+386\s?|0)(\d{1}\s?\d{3}\s?\d{2}\s?\d{2}|\d{2}\s?\d{3}\s?\d{3})$/,
  "sk-SK": /^(\+?421)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
  "sq-AL": /^(\+355|0)6[789]\d{6}$/,
  "sr-RS": /^(\+3816|06)[- \d]{5,9}$/,
  "sv-SE": /^(\+?46|0)[\s\-]?7[\s\-]?[02369]([\s\-]?\d){7}$/,
  "tg-TJ": /^(\+?992)?[5][5]\d{7}$/,
  "th-TH": /^(\+66|66|0)\d{9}$/,
  "tr-TR": /^(\+?90|0)?5\d{9}$/,
  "tk-TM": /^(\+993|993|8)\d{8}$/,
  "uk-UA": /^(\+?38|8)?0\d{9}$/,
  "uz-UZ": /^(\+?998)?(6[125-79]|7[1-69]|88|9\d)\d{7}$/,
  "vi-VN": /^((\+?84)|0)((3([2-9]))|(5([25689]))|(7([0|6-9]))|(8([1-9]))|(9([0-9])))([0-9]{7})$/,
  "zh-CN": /^((\+|00)86)?(1[3-9]|9[28])\d{9}$/,
  "zh-TW": /^(\+?886\-?|0)?9\d{8}$/,
  "dz-BT": /^(\+?975|0)?(17|16|77|02)\d{6}$/,
  "ar-YE": /^(((\+|00)9677|0?7)[0137]\d{7}|((\+|00)967|0)[1-7]\d{6})$/,
  "ar-EH": /^(\+?212|0)[\s\-]?(5288|5289)[\s\-]?\d{5}$/,
  "fa-AF": /^(\+93|0)?(2{1}[0-8]{1}|[3-5]{1}[0-4]{1})(\d{7})$/
};
phones["en-CA"] = phones["en-US"];
phones["fr-CA"] = phones["en-CA"];
phones["fr-BE"] = phones["nl-BE"];
phones["zh-HK"] = phones["en-HK"];
phones["zh-MO"] = phones["en-MO"];
phones["ga-IE"] = phones["en-IE"];
phones["fr-CH"] = phones["de-CH"];
phones["it-CH"] = phones["fr-CH"];
function isMobilePhone(str, locale, options) {
  (0, _assertString$3.default)(str);
  if (options && options.strictMode && !str.startsWith("+")) {
    return false;
  }
  if (Array.isArray(locale)) {
    return locale.some(function(key2) {
      if (phones.hasOwnProperty(key2)) {
        var phone2 = phones[key2];
        if (phone2.test(str)) {
          return true;
        }
      }
      return false;
    });
  } else if (locale in phones) {
    return phones[locale].test(str);
  } else if (!locale || locale === "any") {
    for (var key in phones) {
      if (phones.hasOwnProperty(key)) {
        var phone = phones[key];
        if (phone.test(str)) {
          return true;
        }
      }
    }
    return false;
  }
  throw new Error("Invalid locale '".concat(locale, "'"));
}
var locales$1 = Object.keys(phones);
isMobilePhone$1.locales = locales$1;
var isEthereumAddressExports = {};
var isEthereumAddress = {
  get exports() {
    return isEthereumAddressExports;
  },
  set exports(v) {
    isEthereumAddressExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isEthereumAddress2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var eth = /^(0x)[0-9a-f]{40}$/i;
  function isEthereumAddress2(str) {
    (0, _assertString2.default)(str);
    return eth.test(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isEthereumAddress, isEthereumAddressExports);
var isCurrencyExports = {};
var isCurrency = {
  get exports() {
    return isCurrencyExports;
  },
  set exports(v) {
    isCurrencyExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isCurrency2;
  var _merge = _interopRequireDefault2(mergeExports);
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function currencyRegex(options) {
    var decimal_digits = "\\d{".concat(options.digits_after_decimal[0], "}");
    options.digits_after_decimal.forEach(function(digit, index) {
      if (index !== 0)
        decimal_digits = "".concat(decimal_digits, "|\\d{").concat(digit, "}");
    });
    var symbol = "(".concat(options.symbol.replace(/\W/, function(m) {
      return "\\".concat(m);
    }), ")").concat(options.require_symbol ? "" : "?"), negative = "-?", whole_dollar_amount_without_sep = "[1-9]\\d*", whole_dollar_amount_with_sep = "[1-9]\\d{0,2}(\\".concat(options.thousands_separator, "\\d{3})*"), valid_whole_dollar_amounts = ["0", whole_dollar_amount_without_sep, whole_dollar_amount_with_sep], whole_dollar_amount = "(".concat(valid_whole_dollar_amounts.join("|"), ")?"), decimal_amount = "(\\".concat(options.decimal_separator, "(").concat(decimal_digits, "))").concat(options.require_decimal ? "" : "?");
    var pattern = whole_dollar_amount + (options.allow_decimal || options.require_decimal ? decimal_amount : "");
    if (options.allow_negatives && !options.parens_for_negatives) {
      if (options.negative_sign_after_digits) {
        pattern += negative;
      } else if (options.negative_sign_before_digits) {
        pattern = negative + pattern;
      }
    }
    if (options.allow_negative_sign_placeholder) {
      pattern = "( (?!\\-))?".concat(pattern);
    } else if (options.allow_space_after_symbol) {
      pattern = " ?".concat(pattern);
    } else if (options.allow_space_after_digits) {
      pattern += "( (?!$))?";
    }
    if (options.symbol_after_digits) {
      pattern += symbol;
    } else {
      pattern = symbol + pattern;
    }
    if (options.allow_negatives) {
      if (options.parens_for_negatives) {
        pattern = "(\\(".concat(pattern, "\\)|").concat(pattern, ")");
      } else if (!(options.negative_sign_before_digits || options.negative_sign_after_digits)) {
        pattern = negative + pattern;
      }
    }
    return new RegExp("^(?!-? )(?=.*\\d)".concat(pattern, "$"));
  }
  var default_currency_options = {
    symbol: "$",
    require_symbol: false,
    allow_space_after_symbol: false,
    symbol_after_digits: false,
    allow_negatives: true,
    parens_for_negatives: false,
    negative_sign_before_digits: false,
    negative_sign_after_digits: false,
    allow_negative_sign_placeholder: false,
    thousands_separator: ",",
    decimal_separator: ".",
    allow_decimal: true,
    require_decimal: false,
    digits_after_decimal: [2],
    allow_space_after_digits: false
  };
  function isCurrency2(str, options) {
    (0, _assertString2.default)(str);
    options = (0, _merge.default)(options, default_currency_options);
    return currencyRegex(options).test(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isCurrency, isCurrencyExports);
var isBtcAddressExports = {};
var isBtcAddress = {
  get exports() {
    return isBtcAddressExports;
  },
  set exports(v) {
    isBtcAddressExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isBtcAddress2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var bech32 = /^(bc1)[a-z0-9]{25,39}$/;
  var base58 = /^(1|3)[A-HJ-NP-Za-km-z1-9]{25,39}$/;
  function isBtcAddress2(str) {
    (0, _assertString2.default)(str);
    return bech32.test(str) || base58.test(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isBtcAddress, isBtcAddressExports);
var isISO6391Exports = {};
var isISO6391 = {
  get exports() {
    return isISO6391Exports;
  },
  set exports(v) {
    isISO6391Exports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isISO63912;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var isISO6391Set = /* @__PURE__ */ new Set(["aa", "ab", "ae", "af", "ak", "am", "an", "ar", "as", "av", "ay", "az", "az", "ba", "be", "bg", "bh", "bi", "bm", "bn", "bo", "br", "bs", "ca", "ce", "ch", "co", "cr", "cs", "cu", "cv", "cy", "da", "de", "dv", "dz", "ee", "el", "en", "eo", "es", "et", "eu", "fa", "ff", "fi", "fj", "fo", "fr", "fy", "ga", "gd", "gl", "gn", "gu", "gv", "ha", "he", "hi", "ho", "hr", "ht", "hu", "hy", "hz", "ia", "id", "ie", "ig", "ii", "ik", "io", "is", "it", "iu", "ja", "jv", "ka", "kg", "ki", "kj", "kk", "kl", "km", "kn", "ko", "kr", "ks", "ku", "kv", "kw", "ky", "la", "lb", "lg", "li", "ln", "lo", "lt", "lu", "lv", "mg", "mh", "mi", "mk", "ml", "mn", "mr", "ms", "mt", "my", "na", "nb", "nd", "ne", "ng", "nl", "nn", "no", "nr", "nv", "ny", "oc", "oj", "om", "or", "os", "pa", "pi", "pl", "ps", "pt", "qu", "rm", "rn", "ro", "ru", "rw", "sa", "sc", "sd", "se", "sg", "si", "sk", "sl", "sm", "sn", "so", "sq", "sr", "ss", "st", "su", "sv", "sw", "ta", "te", "tg", "th", "ti", "tk", "tl", "tn", "to", "tr", "ts", "tt", "tw", "ty", "ug", "uk", "ur", "uz", "ve", "vi", "vo", "wa", "wo", "xh", "yi", "yo", "za", "zh", "zu"]);
  function isISO63912(str) {
    (0, _assertString2.default)(str);
    return isISO6391Set.has(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isISO6391, isISO6391Exports);
var isISO8601Exports = {};
var isISO8601 = {
  get exports() {
    return isISO8601Exports;
  },
  set exports(v) {
    isISO8601Exports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isISO86012;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var iso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
  var iso8601StrictSeparator = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
  var isValidDate = function isValidDate2(str) {
    var ordinalMatch = str.match(/^(\d{4})-?(\d{3})([ T]{1}\.*|$)/);
    if (ordinalMatch) {
      var oYear = Number(ordinalMatch[1]);
      var oDay = Number(ordinalMatch[2]);
      if (oYear % 4 === 0 && oYear % 100 !== 0 || oYear % 400 === 0)
        return oDay <= 366;
      return oDay <= 365;
    }
    var match = str.match(/(\d{4})-?(\d{0,2})-?(\d*)/).map(Number);
    var year = match[1];
    var month = match[2];
    var day = match[3];
    var monthString = month ? "0".concat(month).slice(-2) : month;
    var dayString = day ? "0".concat(day).slice(-2) : day;
    var d = new Date("".concat(year, "-").concat(monthString || "01", "-").concat(dayString || "01"));
    if (month && day) {
      return d.getUTCFullYear() === year && d.getUTCMonth() + 1 === month && d.getUTCDate() === day;
    }
    return true;
  };
  function isISO86012(str) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    (0, _assertString2.default)(str);
    var check = options.strictSeparator ? iso8601StrictSeparator.test(str) : iso8601.test(str);
    if (check && options.strict)
      return isValidDate(str);
    return check;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isISO8601, isISO8601Exports);
var isRFC3339Exports = {};
var isRFC3339 = {
  get exports() {
    return isRFC3339Exports;
  },
  set exports(v) {
    isRFC3339Exports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isRFC33392;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var dateFullYear = /[0-9]{4}/;
  var dateMonth = /(0[1-9]|1[0-2])/;
  var dateMDay = /([12]\d|0[1-9]|3[01])/;
  var timeHour = /([01][0-9]|2[0-3])/;
  var timeMinute = /[0-5][0-9]/;
  var timeSecond = /([0-5][0-9]|60)/;
  var timeSecFrac = /(\.[0-9]+)?/;
  var timeNumOffset = new RegExp("[-+]".concat(timeHour.source, ":").concat(timeMinute.source));
  var timeOffset = new RegExp("([zZ]|".concat(timeNumOffset.source, ")"));
  var partialTime = new RegExp("".concat(timeHour.source, ":").concat(timeMinute.source, ":").concat(timeSecond.source).concat(timeSecFrac.source));
  var fullDate = new RegExp("".concat(dateFullYear.source, "-").concat(dateMonth.source, "-").concat(dateMDay.source));
  var fullTime = new RegExp("".concat(partialTime.source).concat(timeOffset.source));
  var rfc3339 = new RegExp("^".concat(fullDate.source, "[ tT]").concat(fullTime.source, "$"));
  function isRFC33392(str) {
    (0, _assertString2.default)(str);
    return rfc3339.test(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isRFC3339, isRFC3339Exports);
var isISO31661Alpha3Exports = {};
var isISO31661Alpha3 = {
  get exports() {
    return isISO31661Alpha3Exports;
  },
  set exports(v) {
    isISO31661Alpha3Exports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isISO31661Alpha32;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var validISO31661Alpha3CountriesCodes = /* @__PURE__ */ new Set(["AFG", "ALA", "ALB", "DZA", "ASM", "AND", "AGO", "AIA", "ATA", "ATG", "ARG", "ARM", "ABW", "AUS", "AUT", "AZE", "BHS", "BHR", "BGD", "BRB", "BLR", "BEL", "BLZ", "BEN", "BMU", "BTN", "BOL", "BES", "BIH", "BWA", "BVT", "BRA", "IOT", "BRN", "BGR", "BFA", "BDI", "KHM", "CMR", "CAN", "CPV", "CYM", "CAF", "TCD", "CHL", "CHN", "CXR", "CCK", "COL", "COM", "COG", "COD", "COK", "CRI", "CIV", "HRV", "CUB", "CUW", "CYP", "CZE", "DNK", "DJI", "DMA", "DOM", "ECU", "EGY", "SLV", "GNQ", "ERI", "EST", "ETH", "FLK", "FRO", "FJI", "FIN", "FRA", "GUF", "PYF", "ATF", "GAB", "GMB", "GEO", "DEU", "GHA", "GIB", "GRC", "GRL", "GRD", "GLP", "GUM", "GTM", "GGY", "GIN", "GNB", "GUY", "HTI", "HMD", "VAT", "HND", "HKG", "HUN", "ISL", "IND", "IDN", "IRN", "IRQ", "IRL", "IMN", "ISR", "ITA", "JAM", "JPN", "JEY", "JOR", "KAZ", "KEN", "KIR", "PRK", "KOR", "KWT", "KGZ", "LAO", "LVA", "LBN", "LSO", "LBR", "LBY", "LIE", "LTU", "LUX", "MAC", "MKD", "MDG", "MWI", "MYS", "MDV", "MLI", "MLT", "MHL", "MTQ", "MRT", "MUS", "MYT", "MEX", "FSM", "MDA", "MCO", "MNG", "MNE", "MSR", "MAR", "MOZ", "MMR", "NAM", "NRU", "NPL", "NLD", "NCL", "NZL", "NIC", "NER", "NGA", "NIU", "NFK", "MNP", "NOR", "OMN", "PAK", "PLW", "PSE", "PAN", "PNG", "PRY", "PER", "PHL", "PCN", "POL", "PRT", "PRI", "QAT", "REU", "ROU", "RUS", "RWA", "BLM", "SHN", "KNA", "LCA", "MAF", "SPM", "VCT", "WSM", "SMR", "STP", "SAU", "SEN", "SRB", "SYC", "SLE", "SGP", "SXM", "SVK", "SVN", "SLB", "SOM", "ZAF", "SGS", "SSD", "ESP", "LKA", "SDN", "SUR", "SJM", "SWZ", "SWE", "CHE", "SYR", "TWN", "TJK", "TZA", "THA", "TLS", "TGO", "TKL", "TON", "TTO", "TUN", "TUR", "TKM", "TCA", "TUV", "UGA", "UKR", "ARE", "GBR", "USA", "UMI", "URY", "UZB", "VUT", "VEN", "VNM", "VGB", "VIR", "WLF", "ESH", "YEM", "ZMB", "ZWE"]);
  function isISO31661Alpha32(str) {
    (0, _assertString2.default)(str);
    return validISO31661Alpha3CountriesCodes.has(str.toUpperCase());
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isISO31661Alpha3, isISO31661Alpha3Exports);
var isISO4217$1 = {};
Object.defineProperty(isISO4217$1, "__esModule", {
  value: true
});
isISO4217$1.default = isISO4217;
isISO4217$1.CurrencyCodes = void 0;
var _assertString$2 = _interopRequireDefault$2(assertStringExports);
function _interopRequireDefault$2(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
var validISO4217CurrencyCodes = /* @__PURE__ */ new Set(["AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BOV", "BRL", "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHE", "CHF", "CHW", "CLF", "CLP", "CNY", "COP", "COU", "CRC", "CUC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "INR", "IQD", "IRR", "ISK", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KMF", "KPW", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRU", "MUR", "MVR", "MWK", "MXN", "MXV", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLL", "SOS", "SRD", "SSP", "STN", "SVC", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "USD", "USN", "UYI", "UYU", "UYW", "UZS", "VES", "VND", "VUV", "WST", "XAF", "XAG", "XAU", "XBA", "XBB", "XBC", "XBD", "XCD", "XDR", "XOF", "XPD", "XPF", "XPT", "XSU", "XTS", "XUA", "XXX", "YER", "ZAR", "ZMW", "ZWL"]);
function isISO4217(str) {
  (0, _assertString$2.default)(str);
  return validISO4217CurrencyCodes.has(str.toUpperCase());
}
var CurrencyCodes = validISO4217CurrencyCodes;
isISO4217$1.CurrencyCodes = CurrencyCodes;
var isBase32Exports = {};
var isBase32 = {
  get exports() {
    return isBase32Exports;
  },
  set exports(v) {
    isBase32Exports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isBase322;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var _merge = _interopRequireDefault2(mergeExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var base32 = /^[A-Z2-7]+=*$/;
  var crockfordBase32 = /^[A-HJKMNP-TV-Z0-9]+$/;
  var defaultBase32Options = {
    crockford: false
  };
  function isBase322(str, options) {
    (0, _assertString2.default)(str);
    options = (0, _merge.default)(options, defaultBase32Options);
    if (options.crockford) {
      return crockfordBase32.test(str);
    }
    var len = str.length;
    if (len % 8 === 0 && base32.test(str)) {
      return true;
    }
    return false;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isBase32, isBase32Exports);
var isBase58Exports = {};
var isBase58 = {
  get exports() {
    return isBase58Exports;
  },
  set exports(v) {
    isBase58Exports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isBase582;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var base58Reg = /^[A-HJ-NP-Za-km-z1-9]*$/;
  function isBase582(str) {
    (0, _assertString2.default)(str);
    if (base58Reg.test(str)) {
      return true;
    }
    return false;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isBase58, isBase58Exports);
var isDataURIExports = {};
var isDataURI = {
  get exports() {
    return isDataURIExports;
  },
  set exports(v) {
    isDataURIExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isDataURI2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var validMediaType = /^[a-z]+\/[a-z0-9\-\+\._]+$/i;
  var validAttribute = /^[a-z\-]+=[a-z0-9\-]+$/i;
  var validData = /^[a-z0-9!\$&'\(\)\*\+,;=\-\._~:@\/\?%\s]*$/i;
  function isDataURI2(str) {
    (0, _assertString2.default)(str);
    var data = str.split(",");
    if (data.length < 2) {
      return false;
    }
    var attributes = data.shift().trim().split(";");
    var schemeAndMediaType = attributes.shift();
    if (schemeAndMediaType.slice(0, 5) !== "data:") {
      return false;
    }
    var mediaType = schemeAndMediaType.slice(5);
    if (mediaType !== "" && !validMediaType.test(mediaType)) {
      return false;
    }
    for (var i = 0; i < attributes.length; i++) {
      if (!(i === attributes.length - 1 && attributes[i].toLowerCase() === "base64") && !validAttribute.test(attributes[i])) {
        return false;
      }
    }
    for (var _i = 0; _i < data.length; _i++) {
      if (!validData.test(data[_i])) {
        return false;
      }
    }
    return true;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isDataURI, isDataURIExports);
var isMagnetURIExports = {};
var isMagnetURI = {
  get exports() {
    return isMagnetURIExports;
  },
  set exports(v) {
    isMagnetURIExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isMagnetURI2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var magnetURIComponent = /(?:^magnet:\?|[^?&]&)xt(?:\.1)?=urn:(?:(?:aich|bitprint|btih|ed2k|ed2khash|kzhash|md5|sha1|tree:tiger):[a-z0-9]{32}(?:[a-z0-9]{8})?|btmh:1220[a-z0-9]{64})(?:$|&)/i;
  function isMagnetURI2(url) {
    (0, _assertString2.default)(url);
    if (url.indexOf("magnet:?") !== 0) {
      return false;
    }
    return magnetURIComponent.test(url);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isMagnetURI, isMagnetURIExports);
var isMimeTypeExports = {};
var isMimeType = {
  get exports() {
    return isMimeTypeExports;
  },
  set exports(v) {
    isMimeTypeExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isMimeType2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var mimeTypeSimple = /^(application|audio|font|image|message|model|multipart|text|video)\/[a-zA-Z0-9\.\-\+_]{1,100}$/i;
  var mimeTypeText = /^text\/[a-zA-Z0-9\.\-\+]{1,100};\s?charset=("[a-zA-Z0-9\.\-\+\s]{0,70}"|[a-zA-Z0-9\.\-\+]{0,70})(\s?\([a-zA-Z0-9\.\-\+\s]{1,20}\))?$/i;
  var mimeTypeMultipart = /^multipart\/[a-zA-Z0-9\.\-\+]{1,100}(;\s?(boundary|charset)=("[a-zA-Z0-9\.\-\+\s]{0,70}"|[a-zA-Z0-9\.\-\+]{0,70})(\s?\([a-zA-Z0-9\.\-\+\s]{1,20}\))?){0,2}$/i;
  function isMimeType2(str) {
    (0, _assertString2.default)(str);
    return mimeTypeSimple.test(str) || mimeTypeText.test(str) || mimeTypeMultipart.test(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isMimeType, isMimeTypeExports);
var isLatLongExports = {};
var isLatLong = {
  get exports() {
    return isLatLongExports;
  },
  set exports(v) {
    isLatLongExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isLatLong2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var _merge = _interopRequireDefault2(mergeExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var lat = /^\(?[+-]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/;
  var long = /^\s?[+-]?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)\)?$/;
  var latDMS = /^(([1-8]?\d)\D+([1-5]?\d|60)\D+([1-5]?\d|60)(\.\d+)?|90\D+0\D+0)\D+[NSns]?$/i;
  var longDMS = /^\s*([1-7]?\d{1,2}\D+([1-5]?\d|60)\D+([1-5]?\d|60)(\.\d+)?|180\D+0\D+0)\D+[EWew]?$/i;
  var defaultLatLongOptions = {
    checkDMS: false
  };
  function isLatLong2(str, options) {
    (0, _assertString2.default)(str);
    options = (0, _merge.default)(options, defaultLatLongOptions);
    if (!str.includes(","))
      return false;
    var pair = str.split(",");
    if (pair[0].startsWith("(") && !pair[1].endsWith(")") || pair[1].endsWith(")") && !pair[0].startsWith("("))
      return false;
    if (options.checkDMS) {
      return latDMS.test(pair[0]) && longDMS.test(pair[1]);
    }
    return lat.test(pair[0]) && long.test(pair[1]);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isLatLong, isLatLongExports);
var isPostalCode$1 = {};
Object.defineProperty(isPostalCode$1, "__esModule", {
  value: true
});
isPostalCode$1.default = isPostalCode;
isPostalCode$1.locales = void 0;
var _assertString$1 = _interopRequireDefault$1(assertStringExports);
function _interopRequireDefault$1(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
var threeDigit = /^\d{3}$/;
var fourDigit = /^\d{4}$/;
var fiveDigit = /^\d{5}$/;
var sixDigit = /^\d{6}$/;
var patterns = {
  AD: /^AD\d{3}$/,
  AT: fourDigit,
  AU: fourDigit,
  AZ: /^AZ\d{4}$/,
  BA: /^([7-8]\d{4}$)/,
  BE: fourDigit,
  BG: fourDigit,
  BR: /^\d{5}-\d{3}$/,
  BY: /^2[1-4]\d{4}$/,
  CA: /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][\s\-]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
  CH: fourDigit,
  CN: /^(0[1-7]|1[012356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[1-5]|8[1345]|9[09])\d{4}$/,
  CZ: /^\d{3}\s?\d{2}$/,
  DE: fiveDigit,
  DK: fourDigit,
  DO: fiveDigit,
  DZ: fiveDigit,
  EE: fiveDigit,
  ES: /^(5[0-2]{1}|[0-4]{1}\d{1})\d{3}$/,
  FI: fiveDigit,
  FR: /^\d{2}\s?\d{3}$/,
  GB: /^(gir\s?0aa|[a-z]{1,2}\d[\da-z]?\s?(\d[a-z]{2})?)$/i,
  GR: /^\d{3}\s?\d{2}$/,
  HR: /^([1-5]\d{4}$)/,
  HT: /^HT\d{4}$/,
  HU: fourDigit,
  ID: fiveDigit,
  IE: /^(?!.*(?:o))[A-Za-z]\d[\dw]\s\w{4}$/i,
  IL: /^(\d{5}|\d{7})$/,
  IN: /^((?!10|29|35|54|55|65|66|86|87|88|89)[1-9][0-9]{5})$/,
  IR: /^(?!(\d)\1{3})[13-9]{4}[1346-9][013-9]{5}$/,
  IS: threeDigit,
  IT: fiveDigit,
  JP: /^\d{3}\-\d{4}$/,
  KE: fiveDigit,
  KR: /^(\d{5}|\d{6})$/,
  LI: /^(948[5-9]|949[0-7])$/,
  LT: /^LT\-\d{5}$/,
  LU: fourDigit,
  LV: /^LV\-\d{4}$/,
  LK: fiveDigit,
  MG: threeDigit,
  MX: fiveDigit,
  MT: /^[A-Za-z]{3}\s{0,1}\d{4}$/,
  MY: fiveDigit,
  NL: /^\d{4}\s?[a-z]{2}$/i,
  NO: fourDigit,
  NP: /^(10|21|22|32|33|34|44|45|56|57)\d{3}$|^(977)$/i,
  NZ: fourDigit,
  PL: /^\d{2}\-\d{3}$/,
  PR: /^00[679]\d{2}([ -]\d{4})?$/,
  PT: /^\d{4}\-\d{3}?$/,
  RO: sixDigit,
  RU: sixDigit,
  SA: fiveDigit,
  SE: /^[1-9]\d{2}\s?\d{2}$/,
  SG: sixDigit,
  SI: fourDigit,
  SK: /^\d{3}\s?\d{2}$/,
  TH: fiveDigit,
  TN: fourDigit,
  TW: /^\d{3}(\d{2})?$/,
  UA: fiveDigit,
  US: /^\d{5}(-\d{4})?$/,
  ZA: fourDigit,
  ZM: fiveDigit
};
var locales = Object.keys(patterns);
isPostalCode$1.locales = locales;
function isPostalCode(str, locale) {
  (0, _assertString$1.default)(str);
  if (locale in patterns) {
    return patterns[locale].test(str);
  } else if (locale === "any") {
    for (var key in patterns) {
      if (patterns.hasOwnProperty(key)) {
        var pattern = patterns[key];
        if (pattern.test(str)) {
          return true;
        }
      }
    }
    return false;
  }
  throw new Error("Invalid locale '".concat(locale, "'"));
}
var ltrimExports = {};
var ltrim = {
  get exports() {
    return ltrimExports;
  },
  set exports(v) {
    ltrimExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = ltrim2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function ltrim2(str, chars) {
    (0, _assertString2.default)(str);
    var pattern = chars ? new RegExp("^[".concat(chars.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "]+"), "g") : /^\s+/g;
    return str.replace(pattern, "");
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(ltrim, ltrimExports);
var rtrimExports = {};
var rtrim = {
  get exports() {
    return rtrimExports;
  },
  set exports(v) {
    rtrimExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = rtrim2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function rtrim2(str, chars) {
    (0, _assertString2.default)(str);
    if (chars) {
      var pattern = new RegExp("[".concat(chars.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "]+$"), "g");
      return str.replace(pattern, "");
    }
    var strIndex = str.length - 1;
    while (/\s/.test(str.charAt(strIndex))) {
      strIndex -= 1;
    }
    return str.slice(0, strIndex + 1);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(rtrim, rtrimExports);
var trimExports = {};
var trim = {
  get exports() {
    return trimExports;
  },
  set exports(v) {
    trimExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = trim2;
  var _rtrim = _interopRequireDefault2(rtrimExports);
  var _ltrim = _interopRequireDefault2(ltrimExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function trim2(str, chars) {
    return (0, _rtrim.default)((0, _ltrim.default)(str, chars), chars);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(trim, trimExports);
var _escapeExports = {};
var _escape = {
  get exports() {
    return _escapeExports;
  },
  set exports(v) {
    _escapeExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = escape;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function escape(str) {
    (0, _assertString2.default)(str);
    return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\//g, "&#x2F;").replace(/\\/g, "&#x5C;").replace(/`/g, "&#96;");
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(_escape, _escapeExports);
var _unescapeExports = {};
var _unescape = {
  get exports() {
    return _unescapeExports;
  },
  set exports(v) {
    _unescapeExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = unescape;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function unescape(str) {
    (0, _assertString2.default)(str);
    return str.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#x2F;/g, "/").replace(/&#x5C;/g, "\\").replace(/&#96;/g, "`").replace(/&amp;/g, "&");
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(_unescape, _unescapeExports);
var stripLowExports = {};
var stripLow = {
  get exports() {
    return stripLowExports;
  },
  set exports(v) {
    stripLowExports = v;
  }
};
var blacklistExports = {};
var blacklist = {
  get exports() {
    return blacklistExports;
  },
  set exports(v) {
    blacklistExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = blacklist2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function blacklist2(str, chars) {
    (0, _assertString2.default)(str);
    return str.replace(new RegExp("[".concat(chars, "]+"), "g"), "");
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(blacklist, blacklistExports);
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = stripLow2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  var _blacklist = _interopRequireDefault2(blacklistExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function stripLow2(str, keep_new_lines) {
    (0, _assertString2.default)(str);
    var chars = keep_new_lines ? "\\x00-\\x09\\x0B\\x0C\\x0E-\\x1F\\x7F" : "\\x00-\\x1F\\x7F";
    return (0, _blacklist.default)(str, chars);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(stripLow, stripLowExports);
var whitelistExports = {};
var whitelist = {
  get exports() {
    return whitelistExports;
  },
  set exports(v) {
    whitelistExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = whitelist2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function whitelist2(str, chars) {
    (0, _assertString2.default)(str);
    return str.replace(new RegExp("[^".concat(chars, "]+"), "g"), "");
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(whitelist, whitelistExports);
var isWhitelistedExports = {};
var isWhitelisted = {
  get exports() {
    return isWhitelistedExports;
  },
  set exports(v) {
    isWhitelistedExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isWhitelisted2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function isWhitelisted2(str, chars) {
    (0, _assertString2.default)(str);
    for (var i = str.length - 1; i >= 0; i--) {
      if (chars.indexOf(str[i]) === -1) {
        return false;
      }
    }
    return true;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isWhitelisted, isWhitelistedExports);
var normalizeEmailExports = {};
var normalizeEmail = {
  get exports() {
    return normalizeEmailExports;
  },
  set exports(v) {
    normalizeEmailExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = normalizeEmail2;
  var _merge = _interopRequireDefault2(mergeExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var default_normalize_email_options = {
    // The following options apply to all email addresses
    // Lowercases the local part of the email address.
    // Please note this may violate RFC 5321 as per http://stackoverflow.com/a/9808332/192024).
    // The domain is always lowercased, as per RFC 1035
    all_lowercase: true,
    // The following conversions are specific to GMail
    // Lowercases the local part of the GMail address (known to be case-insensitive)
    gmail_lowercase: true,
    // Removes dots from the local part of the email address, as that's ignored by GMail
    gmail_remove_dots: true,
    // Removes the subaddress (e.g. "+foo") from the email address
    gmail_remove_subaddress: true,
    // Conversts the googlemail.com domain to gmail.com
    gmail_convert_googlemaildotcom: true,
    // The following conversions are specific to Outlook.com / Windows Live / Hotmail
    // Lowercases the local part of the Outlook.com address (known to be case-insensitive)
    outlookdotcom_lowercase: true,
    // Removes the subaddress (e.g. "+foo") from the email address
    outlookdotcom_remove_subaddress: true,
    // The following conversions are specific to Yahoo
    // Lowercases the local part of the Yahoo address (known to be case-insensitive)
    yahoo_lowercase: true,
    // Removes the subaddress (e.g. "-foo") from the email address
    yahoo_remove_subaddress: true,
    // The following conversions are specific to Yandex
    // Lowercases the local part of the Yandex address (known to be case-insensitive)
    yandex_lowercase: true,
    // The following conversions are specific to iCloud
    // Lowercases the local part of the iCloud address (known to be case-insensitive)
    icloud_lowercase: true,
    // Removes the subaddress (e.g. "+foo") from the email address
    icloud_remove_subaddress: true
  };
  var icloud_domains = ["icloud.com", "me.com"];
  var outlookdotcom_domains = ["hotmail.at", "hotmail.be", "hotmail.ca", "hotmail.cl", "hotmail.co.il", "hotmail.co.nz", "hotmail.co.th", "hotmail.co.uk", "hotmail.com", "hotmail.com.ar", "hotmail.com.au", "hotmail.com.br", "hotmail.com.gr", "hotmail.com.mx", "hotmail.com.pe", "hotmail.com.tr", "hotmail.com.vn", "hotmail.cz", "hotmail.de", "hotmail.dk", "hotmail.es", "hotmail.fr", "hotmail.hu", "hotmail.id", "hotmail.ie", "hotmail.in", "hotmail.it", "hotmail.jp", "hotmail.kr", "hotmail.lv", "hotmail.my", "hotmail.ph", "hotmail.pt", "hotmail.sa", "hotmail.sg", "hotmail.sk", "live.be", "live.co.uk", "live.com", "live.com.ar", "live.com.mx", "live.de", "live.es", "live.eu", "live.fr", "live.it", "live.nl", "msn.com", "outlook.at", "outlook.be", "outlook.cl", "outlook.co.il", "outlook.co.nz", "outlook.co.th", "outlook.com", "outlook.com.ar", "outlook.com.au", "outlook.com.br", "outlook.com.gr", "outlook.com.pe", "outlook.com.tr", "outlook.com.vn", "outlook.cz", "outlook.de", "outlook.dk", "outlook.es", "outlook.fr", "outlook.hu", "outlook.id", "outlook.ie", "outlook.in", "outlook.it", "outlook.jp", "outlook.kr", "outlook.lv", "outlook.my", "outlook.ph", "outlook.pt", "outlook.sa", "outlook.sg", "outlook.sk", "passport.com"];
  var yahoo_domains = ["rocketmail.com", "yahoo.ca", "yahoo.co.uk", "yahoo.com", "yahoo.de", "yahoo.fr", "yahoo.in", "yahoo.it", "ymail.com"];
  var yandex_domains = ["yandex.ru", "yandex.ua", "yandex.kz", "yandex.com", "yandex.by", "ya.ru"];
  function dotsReplacer(match) {
    if (match.length > 1) {
      return match;
    }
    return "";
  }
  function normalizeEmail2(email, options) {
    options = (0, _merge.default)(options, default_normalize_email_options);
    var raw_parts = email.split("@");
    var domain = raw_parts.pop();
    var user = raw_parts.join("@");
    var parts = [user, domain];
    parts[1] = parts[1].toLowerCase();
    if (parts[1] === "gmail.com" || parts[1] === "googlemail.com") {
      if (options.gmail_remove_subaddress) {
        parts[0] = parts[0].split("+")[0];
      }
      if (options.gmail_remove_dots) {
        parts[0] = parts[0].replace(/\.+/g, dotsReplacer);
      }
      if (!parts[0].length) {
        return false;
      }
      if (options.all_lowercase || options.gmail_lowercase) {
        parts[0] = parts[0].toLowerCase();
      }
      parts[1] = options.gmail_convert_googlemaildotcom ? "gmail.com" : parts[1];
    } else if (icloud_domains.indexOf(parts[1]) >= 0) {
      if (options.icloud_remove_subaddress) {
        parts[0] = parts[0].split("+")[0];
      }
      if (!parts[0].length) {
        return false;
      }
      if (options.all_lowercase || options.icloud_lowercase) {
        parts[0] = parts[0].toLowerCase();
      }
    } else if (outlookdotcom_domains.indexOf(parts[1]) >= 0) {
      if (options.outlookdotcom_remove_subaddress) {
        parts[0] = parts[0].split("+")[0];
      }
      if (!parts[0].length) {
        return false;
      }
      if (options.all_lowercase || options.outlookdotcom_lowercase) {
        parts[0] = parts[0].toLowerCase();
      }
    } else if (yahoo_domains.indexOf(parts[1]) >= 0) {
      if (options.yahoo_remove_subaddress) {
        var components = parts[0].split("-");
        parts[0] = components.length > 1 ? components.slice(0, -1).join("-") : components[0];
      }
      if (!parts[0].length) {
        return false;
      }
      if (options.all_lowercase || options.yahoo_lowercase) {
        parts[0] = parts[0].toLowerCase();
      }
    } else if (yandex_domains.indexOf(parts[1]) >= 0) {
      if (options.all_lowercase || options.yandex_lowercase) {
        parts[0] = parts[0].toLowerCase();
      }
      parts[1] = "yandex.ru";
    } else if (options.all_lowercase) {
      parts[0] = parts[0].toLowerCase();
    }
    return parts.join("@");
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(normalizeEmail, normalizeEmailExports);
var isSlugExports = {};
var isSlug = {
  get exports() {
    return isSlugExports;
  },
  set exports(v) {
    isSlugExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isSlug2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var charsetRegex = /^[^\s-_](?!.*?[-_]{2,})[a-z0-9-\\][^\s]*[^-_\s]$/;
  function isSlug2(str) {
    (0, _assertString2.default)(str);
    return charsetRegex.test(str);
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isSlug, isSlugExports);
var isLicensePlateExports = {};
var isLicensePlate = {
  get exports() {
    return isLicensePlateExports;
  },
  set exports(v) {
    isLicensePlateExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isLicensePlate2;
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var validators = {
    "cs-CZ": function csCZ(str) {
      return /^(([ABCDEFHIJKLMNPRSTUVXYZ]|[0-9])-?){5,8}$/.test(str);
    },
    "de-DE": function deDE(str) {
      return /^((A|AA|AB|AC|AE|AH|AK|AM|AN|AÖ|AP|AS|AT|AU|AW|AZ|B|BA|BB|BC|BE|BF|BH|BI|BK|BL|BM|BN|BO|BÖ|BS|BT|BZ|C|CA|CB|CE|CO|CR|CW|D|DA|DD|DE|DH|DI|DL|DM|DN|DO|DU|DW|DZ|E|EA|EB|ED|EE|EF|EG|EH|EI|EL|EM|EN|ER|ES|EU|EW|F|FB|FD|FF|FG|FI|FL|FN|FO|FR|FS|FT|FÜ|FW|FZ|G|GA|GC|GD|GE|GF|GG|GI|GK|GL|GM|GN|GÖ|GP|GR|GS|GT|GÜ|GV|GW|GZ|H|HA|HB|HC|HD|HE|HF|HG|HH|HI|HK|HL|HM|HN|HO|HP|HR|HS|HU|HV|HX|HY|HZ|IK|IL|IN|IZ|J|JE|JL|K|KA|KB|KC|KE|KF|KG|KH|KI|KK|KL|KM|KN|KO|KR|KS|KT|KU|KW|KY|L|LA|LB|LC|LD|LF|LG|LH|LI|LL|LM|LN|LÖ|LP|LR|LU|M|MA|MB|MC|MD|ME|MG|MH|MI|MK|ML|MM|MN|MO|MQ|MR|MS|MÜ|MW|MY|MZ|N|NB|ND|NE|NF|NH|NI|NK|NM|NÖ|NP|NR|NT|NU|NW|NY|NZ|OA|OB|OC|OD|OE|OF|OG|OH|OK|OL|OP|OS|OZ|P|PA|PB|PE|PF|PI|PL|PM|PN|PR|PS|PW|PZ|R|RA|RC|RD|RE|RG|RH|RI|RL|RM|RN|RO|RP|RS|RT|RU|RV|RW|RZ|S|SB|SC|SE|SG|SI|SK|SL|SM|SN|SO|SP|SR|ST|SU|SW|SY|SZ|TE|TF|TG|TO|TP|TR|TS|TT|TÜ|ÜB|UE|UH|UL|UM|UN|V|VB|VG|VK|VR|VS|W|WA|WB|WE|WF|WI|WK|WL|WM|WN|WO|WR|WS|WT|WÜ|WW|WZ|Z|ZE|ZI|ZP|ZR|ZW|ZZ)[- ]?[A-Z]{1,2}[- ]?\d{1,4}|(ABG|ABI|AIB|AIC|ALF|ALZ|ANA|ANG|ANK|APD|ARN|ART|ASL|ASZ|AUR|AZE|BAD|BAR|BBG|BCH|BED|BER|BGD|BGL|BID|BIN|BIR|BIT|BIW|BKS|BLB|BLK|BNA|BOG|BOH|BOR|BOT|BRA|BRB|BRG|BRK|BRL|BRV|BSB|BSK|BTF|BÜD|BUL|BÜR|BÜS|BÜZ|CAS|CHA|CLP|CLZ|COC|COE|CUX|DAH|DAN|DAU|DBR|DEG|DEL|DGF|DIL|DIN|DIZ|DKB|DLG|DON|DUD|DÜW|EBE|EBN|EBS|ECK|EIC|EIL|EIN|EIS|EMD|EMS|ERB|ERH|ERK|ERZ|ESB|ESW|FDB|FDS|FEU|FFB|FKB|FLÖ|FOR|FRG|FRI|FRW|FTL|FÜS|GAN|GAP|GDB|GEL|GEO|GER|GHA|GHC|GLA|GMN|GNT|GOA|GOH|GRA|GRH|GRI|GRM|GRZ|GTH|GUB|GUN|GVM|HAB|HAL|HAM|HAS|HBN|HBS|HCH|HDH|HDL|HEB|HEF|HEI|HER|HET|HGN|HGW|HHM|HIG|HIP|HMÜ|HOG|HOH|HOL|HOM|HOR|HÖS|HOT|HRO|HSK|HST|HVL|HWI|IGB|ILL|JÜL|KEH|KEL|KEM|KIB|KLE|KLZ|KÖN|KÖT|KÖZ|KRU|KÜN|KUS|KYF|LAN|LAU|LBS|LBZ|LDK|LDS|LEO|LER|LEV|LIB|LIF|LIP|LÖB|LOS|LRO|LSZ|LÜN|LUP|LWL|MAB|MAI|MAK|MAL|MED|MEG|MEI|MEK|MEL|MER|MET|MGH|MGN|MHL|MIL|MKK|MOD|MOL|MON|MOS|MSE|MSH|MSP|MST|MTK|MTL|MÜB|MÜR|MYK|MZG|NAB|NAI|NAU|NDH|NEA|NEB|NEC|NEN|NES|NEW|NMB|NMS|NOH|NOL|NOM|NOR|NVP|NWM|OAL|OBB|OBG|OCH|OHA|ÖHR|OHV|OHZ|OPR|OSL|OVI|OVL|OVP|PAF|PAN|PAR|PCH|PEG|PIR|PLÖ|PRÜ|QFT|QLB|RDG|REG|REH|REI|RID|RIE|ROD|ROF|ROK|ROL|ROS|ROT|ROW|RSL|RÜD|RÜG|SAB|SAD|SAN|SAW|SBG|SBK|SCZ|SDH|SDL|SDT|SEB|SEE|SEF|SEL|SFB|SFT|SGH|SHA|SHG|SHK|SHL|SIG|SIM|SLE|SLF|SLK|SLN|SLS|SLÜ|SLZ|SMÜ|SOB|SOG|SOK|SÖM|SON|SPB|SPN|SRB|SRO|STA|STB|STD|STE|STL|SUL|SÜW|SWA|SZB|TBB|TDO|TET|TIR|TÖL|TUT|UEM|UER|UFF|USI|VAI|VEC|VER|VIB|VIE|VIT|VOH|WAF|WAK|WAN|WAR|WAT|WBS|WDA|WEL|WEN|WER|WES|WHV|WIL|WIS|WIT|WIZ|WLG|WMS|WND|WOB|WOH|WOL|WOR|WOS|WRN|WSF|WST|WSW|WTL|WTM|WUG|WÜM|WUN|WUR|WZL|ZEL|ZIG)[- ]?(([A-Z][- ]?\d{1,4})|([A-Z]{2}[- ]?\d{1,3})))[- ]?(E|H)?$/.test(str);
    },
    "de-LI": function deLI(str) {
      return /^FL[- ]?\d{1,5}[UZ]?$/.test(str);
    },
    "en-IN": function enIN(str) {
      return /^[A-Z]{2}[ -]?[0-9]{1,2}(?:[ -]?[A-Z])(?:[ -]?[A-Z]*)?[ -]?[0-9]{4}$/.test(str);
    },
    "es-AR": function esAR(str) {
      return /^(([A-Z]{2} ?[0-9]{3} ?[A-Z]{2})|([A-Z]{3} ?[0-9]{3}))$/.test(str);
    },
    "fi-FI": function fiFI(str) {
      return /^(?=.{4,7})(([A-Z]{1,3}|[0-9]{1,3})[\s-]?([A-Z]{1,3}|[0-9]{1,5}))$/.test(str);
    },
    "hu-HU": function huHU(str) {
      return /^((((?!AAA)(([A-NPRSTVZWXY]{1})([A-PR-Z]{1})([A-HJ-NPR-Z]))|(A[ABC]I)|A[ABC]O|A[A-W]Q|BPI|BPO|UCO|UDO|XAO)-(?!000)\d{3})|(M\d{6})|((CK|DT|CD|HC|H[ABEFIKLMNPRSTVX]|MA|OT|R[A-Z]) \d{2}-\d{2})|(CD \d{3}-\d{3})|(C-(C|X) \d{4})|(X-(A|B|C) \d{4})|(([EPVZ]-\d{5}))|(S A[A-Z]{2} \d{2})|(SP \d{2}-\d{2}))$/.test(str);
    },
    "pt-BR": function ptBR(str) {
      return /^[A-Z]{3}[ -]?[0-9][A-Z][0-9]{2}|[A-Z]{3}[ -]?[0-9]{4}$/.test(str);
    },
    "pt-PT": function ptPT(str) {
      return /^([A-Z]{2}|[0-9]{2})[ -·]?([A-Z]{2}|[0-9]{2})[ -·]?([A-Z]{2}|[0-9]{2})$/.test(str);
    },
    "sq-AL": function sqAL(str) {
      return /^[A-Z]{2}[- ]?((\d{3}[- ]?(([A-Z]{2})|T))|(R[- ]?\d{3}))$/.test(str);
    },
    "sv-SE": function svSE(str) {
      return /^[A-HJ-PR-UW-Z]{3} ?[\d]{2}[A-HJ-PR-UW-Z1-9]$|(^[A-ZÅÄÖ ]{2,7}$)/.test(str.trim());
    }
  };
  function isLicensePlate2(str, locale) {
    (0, _assertString2.default)(str);
    if (locale in validators) {
      return validators[locale](str);
    } else if (locale === "any") {
      for (var key in validators) {
        var validator2 = validators[key];
        if (validator2(str)) {
          return true;
        }
      }
      return false;
    }
    throw new Error("Invalid locale '".concat(locale, "'"));
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isLicensePlate, isLicensePlateExports);
var isStrongPasswordExports = {};
var isStrongPassword = {
  get exports() {
    return isStrongPasswordExports;
  },
  set exports(v) {
    isStrongPasswordExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isStrongPassword2;
  var _merge = _interopRequireDefault2(mergeExports);
  var _assertString2 = _interopRequireDefault2(assertStringExports);
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var upperCaseRegex = /^[A-Z]$/;
  var lowerCaseRegex = /^[a-z]$/;
  var numberRegex = /^[0-9]$/;
  var symbolRegex = /^[-#!$@£%^&*()_+|~=`{}\[\]:";'<>?,.\/ ]$/;
  var defaultOptions = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    returnScore: false,
    pointsPerUnique: 1,
    pointsPerRepeat: 0.5,
    pointsForContainingLower: 10,
    pointsForContainingUpper: 10,
    pointsForContainingNumber: 10,
    pointsForContainingSymbol: 10
  };
  function countChars(str) {
    var result = {};
    Array.from(str).forEach(function(char) {
      var curVal = result[char];
      if (curVal) {
        result[char] += 1;
      } else {
        result[char] = 1;
      }
    });
    return result;
  }
  function analyzePassword(password) {
    var charMap = countChars(password);
    var analysis = {
      length: password.length,
      uniqueChars: Object.keys(charMap).length,
      uppercaseCount: 0,
      lowercaseCount: 0,
      numberCount: 0,
      symbolCount: 0
    };
    Object.keys(charMap).forEach(function(char) {
      if (upperCaseRegex.test(char)) {
        analysis.uppercaseCount += charMap[char];
      } else if (lowerCaseRegex.test(char)) {
        analysis.lowercaseCount += charMap[char];
      } else if (numberRegex.test(char)) {
        analysis.numberCount += charMap[char];
      } else if (symbolRegex.test(char)) {
        analysis.symbolCount += charMap[char];
      }
    });
    return analysis;
  }
  function scorePassword(analysis, scoringOptions) {
    var points = 0;
    points += analysis.uniqueChars * scoringOptions.pointsPerUnique;
    points += (analysis.length - analysis.uniqueChars) * scoringOptions.pointsPerRepeat;
    if (analysis.lowercaseCount > 0) {
      points += scoringOptions.pointsForContainingLower;
    }
    if (analysis.uppercaseCount > 0) {
      points += scoringOptions.pointsForContainingUpper;
    }
    if (analysis.numberCount > 0) {
      points += scoringOptions.pointsForContainingNumber;
    }
    if (analysis.symbolCount > 0) {
      points += scoringOptions.pointsForContainingSymbol;
    }
    return points;
  }
  function isStrongPassword2(str) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    (0, _assertString2.default)(str);
    var analysis = analyzePassword(str);
    options = (0, _merge.default)(options || {}, defaultOptions);
    if (options.returnScore) {
      return scorePassword(analysis, options);
    }
    return analysis.length >= options.minLength && analysis.lowercaseCount >= options.minLowercase && analysis.uppercaseCount >= options.minUppercase && analysis.numberCount >= options.minNumbers && analysis.symbolCount >= options.minSymbols;
  }
  module.exports = exports.default;
  module.exports.default = exports.default;
})(isStrongPassword, isStrongPasswordExports);
var isVAT$1 = {};
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
Object.defineProperty(isVAT$1, "__esModule", {
  value: true
});
isVAT$1.default = isVAT;
isVAT$1.vatMatchers = void 0;
var _assertString = _interopRequireDefault(assertStringExports);
var algorithms = _interopRequireWildcard(algorithms$1);
function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function")
    return null;
  var cache = /* @__PURE__ */ new WeakMap();
  _getRequireWildcardCache = function _getRequireWildcardCache2() {
    return cache;
  };
  return cache;
}
function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache();
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
var PT = function PT2(str) {
  var match = str.match(/^(PT)?(\d{9})$/);
  if (!match) {
    return false;
  }
  var tin = match[2];
  var checksum = 11 - algorithms.reverseMultiplyAndSum(tin.split("").slice(0, 8).map(function(a) {
    return parseInt(a, 10);
  }), 9) % 11;
  if (checksum > 9) {
    return parseInt(tin[8], 10) === 0;
  }
  return checksum === parseInt(tin[8], 10);
};
var vatMatchers = {
  /**
   * European Union VAT identification numbers
   */
  AT: function AT(str) {
    return /^(AT)?U\d{8}$/.test(str);
  },
  BE: function BE(str) {
    return /^(BE)?\d{10}$/.test(str);
  },
  BG: function BG(str) {
    return /^(BG)?\d{9,10}$/.test(str);
  },
  HR: function HR(str) {
    return /^(HR)?\d{11}$/.test(str);
  },
  CY: function CY(str) {
    return /^(CY)?\w{9}$/.test(str);
  },
  CZ: function CZ(str) {
    return /^(CZ)?\d{8,10}$/.test(str);
  },
  DK: function DK(str) {
    return /^(DK)?\d{8}$/.test(str);
  },
  EE: function EE(str) {
    return /^(EE)?\d{9}$/.test(str);
  },
  FI: function FI(str) {
    return /^(FI)?\d{8}$/.test(str);
  },
  FR: function FR(str) {
    return /^(FR)?\w{2}\d{9}$/.test(str);
  },
  DE: function DE(str) {
    return /^(DE)?\d{9}$/.test(str);
  },
  EL: function EL(str) {
    return /^(EL)?\d{9}$/.test(str);
  },
  HU: function HU(str) {
    return /^(HU)?\d{8}$/.test(str);
  },
  IE: function IE(str) {
    return /^(IE)?\d{7}\w{1}(W)?$/.test(str);
  },
  IT: function IT(str) {
    return /^(IT)?\d{11}$/.test(str);
  },
  LV: function LV(str) {
    return /^(LV)?\d{11}$/.test(str);
  },
  LT: function LT(str) {
    return /^(LT)?\d{9,12}$/.test(str);
  },
  LU: function LU(str) {
    return /^(LU)?\d{8}$/.test(str);
  },
  MT: function MT(str) {
    return /^(MT)?\d{8}$/.test(str);
  },
  NL: function NL(str) {
    return /^(NL)?\d{9}B\d{2}$/.test(str);
  },
  PL: function PL(str) {
    return /^(PL)?(\d{10}|(\d{3}-\d{3}-\d{2}-\d{2})|(\d{3}-\d{2}-\d{2}-\d{3}))$/.test(str);
  },
  PT,
  RO: function RO(str) {
    return /^(RO)?\d{2,10}$/.test(str);
  },
  SK: function SK(str) {
    return /^(SK)?\d{10}$/.test(str);
  },
  SI: function SI(str) {
    return /^(SI)?\d{8}$/.test(str);
  },
  ES: function ES(str) {
    return /^(ES)?\w\d{7}[A-Z]$/.test(str);
  },
  SE: function SE(str) {
    return /^(SE)?\d{12}$/.test(str);
  },
  /**
   * VAT numbers of non-EU countries
   */
  AL: function AL(str) {
    return /^(AL)?\w{9}[A-Z]$/.test(str);
  },
  MK: function MK(str) {
    return /^(MK)?\d{13}$/.test(str);
  },
  AU: function AU(str) {
    return /^(AU)?\d{11}$/.test(str);
  },
  BY: function BY(str) {
    return /^(УНП )?\d{9}$/.test(str);
  },
  CA: function CA(str) {
    return /^(CA)?\d{9}$/.test(str);
  },
  IS: function IS(str) {
    return /^(IS)?\d{5,6}$/.test(str);
  },
  IN: function IN(str) {
    return /^(IN)?\d{15}$/.test(str);
  },
  ID: function ID(str) {
    return /^(ID)?(\d{15}|(\d{2}.\d{3}.\d{3}.\d{1}-\d{3}.\d{3}))$/.test(str);
  },
  IL: function IL(str) {
    return /^(IL)?\d{9}$/.test(str);
  },
  KZ: function KZ(str) {
    return /^(KZ)?\d{9}$/.test(str);
  },
  NZ: function NZ(str) {
    return /^(NZ)?\d{9}$/.test(str);
  },
  NG: function NG(str) {
    return /^(NG)?(\d{12}|(\d{8}-\d{4}))$/.test(str);
  },
  NO: function NO2(str) {
    return /^(NO)?\d{9}MVA$/.test(str);
  },
  PH: function PH(str) {
    return /^(PH)?(\d{12}|\d{3} \d{3} \d{3} \d{3})$/.test(str);
  },
  RU: function RU(str) {
    return /^(RU)?(\d{10}|\d{12})$/.test(str);
  },
  SM: function SM(str) {
    return /^(SM)?\d{5}$/.test(str);
  },
  SA: function SA(str) {
    return /^(SA)?\d{15}$/.test(str);
  },
  RS: function RS(str) {
    return /^(RS)?\d{9}$/.test(str);
  },
  CH: function CH(str) {
    return /^(CH)?(\d{6}|\d{9}|(\d{3}.\d{3})|(\d{3}.\d{3}.\d{3}))(TVA|MWST|IVA)$/.test(str);
  },
  TR: function TR(str) {
    return /^(TR)?\d{10}$/.test(str);
  },
  UA: function UA(str) {
    return /^(UA)?\d{12}$/.test(str);
  },
  GB: function GB(str) {
    return /^GB((\d{3} \d{4} ([0-8][0-9]|9[0-6]))|(\d{9} \d{3})|(((GD[0-4])|(HA[5-9]))[0-9]{2}))$/.test(str);
  },
  UZ: function UZ(str) {
    return /^(UZ)?\d{9}$/.test(str);
  },
  /**
   * VAT numbers of Latin American countries
   */
  AR: function AR(str) {
    return /^(AR)?\d{11}$/.test(str);
  },
  BO: function BO(str) {
    return /^(BO)?\d{7}$/.test(str);
  },
  BR: function BR(str) {
    return /^(BR)?((\d{2}.\d{3}.\d{3}\/\d{4}-\d{2})|(\d{3}.\d{3}.\d{3}-\d{2}))$/.test(str);
  },
  CL: function CL(str) {
    return /^(CL)?\d{8}-\d{1}$/.test(str);
  },
  CO: function CO(str) {
    return /^(CO)?\d{10}$/.test(str);
  },
  CR: function CR(str) {
    return /^(CR)?\d{9,12}$/.test(str);
  },
  EC: function EC(str) {
    return /^(EC)?\d{13}$/.test(str);
  },
  SV: function SV(str) {
    return /^(SV)?\d{4}-\d{6}-\d{3}-\d{1}$/.test(str);
  },
  GT: function GT(str) {
    return /^(GT)?\d{7}-\d{1}$/.test(str);
  },
  HN: function HN(str) {
    return /^(HN)?$/.test(str);
  },
  MX: function MX(str) {
    return /^(MX)?\w{3,4}\d{6}\w{3}$/.test(str);
  },
  NI: function NI(str) {
    return /^(NI)?\d{3}-\d{6}-\d{4}\w{1}$/.test(str);
  },
  PA: function PA(str) {
    return /^(PA)?$/.test(str);
  },
  PY: function PY(str) {
    return /^(PY)?\d{6,8}-\d{1}$/.test(str);
  },
  PE: function PE(str) {
    return /^(PE)?\d{11}$/.test(str);
  },
  DO: function DO(str) {
    return /^(DO)?(\d{11}|(\d{3}-\d{7}-\d{1})|[1,4,5]{1}\d{8}|([1,4,5]{1})-\d{2}-\d{5}-\d{1})$/.test(str);
  },
  UY: function UY(str) {
    return /^(UY)?\d{12}$/.test(str);
  },
  VE: function VE(str) {
    return /^(VE)?[J,G,V,E]{1}-(\d{9}|(\d{8}-\d{1}))$/.test(str);
  }
};
isVAT$1.vatMatchers = vatMatchers;
function isVAT(str, countryCode) {
  (0, _assertString.default)(str);
  (0, _assertString.default)(countryCode);
  if (countryCode in vatMatchers) {
    return vatMatchers[countryCode](str);
  }
  throw new Error("Invalid country code: '".concat(countryCode, "'"));
}
(function(module, exports) {
  function _typeof2(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof2 = function _typeof3(obj2) {
        return typeof obj2;
      };
    } else {
      _typeof2 = function _typeof3(obj2) {
        return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
      };
    }
    return _typeof2(obj);
  }
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var _toDate = _interopRequireDefault2(toDateExports);
  var _toFloat = _interopRequireDefault2(toFloatExports);
  var _toInt = _interopRequireDefault2(toIntExports);
  var _toBoolean = _interopRequireDefault2(toBooleanExports);
  var _equals = _interopRequireDefault2(equalsExports);
  var _contains = _interopRequireDefault2(containsExports);
  var _matches = _interopRequireDefault2(matchesExports);
  var _isEmail = _interopRequireDefault2(isEmailExports);
  var _isURL = _interopRequireDefault2(isURLExports);
  var _isMACAddress = _interopRequireDefault2(isMACAddressExports);
  var _isIP = _interopRequireDefault2(isIPExports);
  var _isIPRange = _interopRequireDefault2(isIPRangeExports);
  var _isFQDN = _interopRequireDefault2(isFQDNExports);
  var _isDate = _interopRequireDefault2(isDateExports);
  var _isTime = _interopRequireDefault2(isTimeExports);
  var _isBoolean = _interopRequireDefault2(isBooleanExports);
  var _isLocale = _interopRequireDefault2(isLocaleExports);
  var _isAlpha = _interopRequireWildcard2(isAlpha$1);
  var _isAlphanumeric = _interopRequireWildcard2(isAlphanumeric$1);
  var _isNumeric = _interopRequireDefault2(isNumericExports);
  var _isPassportNumber = _interopRequireDefault2(isPassportNumberExports);
  var _isPort = _interopRequireDefault2(isPortExports);
  var _isLowercase = _interopRequireDefault2(isLowercaseExports);
  var _isUppercase = _interopRequireDefault2(isUppercaseExports);
  var _isIMEI = _interopRequireDefault2(isIMEIExports);
  var _isAscii = _interopRequireDefault2(isAsciiExports);
  var _isFullWidth = _interopRequireDefault2(isFullWidth$1);
  var _isHalfWidth = _interopRequireDefault2(isHalfWidth$1);
  var _isVariableWidth = _interopRequireDefault2(isVariableWidthExports);
  var _isMultibyte = _interopRequireDefault2(isMultibyteExports);
  var _isSemVer = _interopRequireDefault2(isSemVerExports);
  var _isSurrogatePair = _interopRequireDefault2(isSurrogatePairExports);
  var _isInt = _interopRequireDefault2(isIntExports);
  var _isFloat = _interopRequireWildcard2(isFloat$1);
  var _isDecimal = _interopRequireDefault2(isDecimalExports);
  var _isHexadecimal = _interopRequireDefault2(isHexadecimalExports);
  var _isOctal = _interopRequireDefault2(isOctalExports);
  var _isDivisibleBy = _interopRequireDefault2(isDivisibleByExports);
  var _isHexColor = _interopRequireDefault2(isHexColorExports);
  var _isRgbColor = _interopRequireDefault2(isRgbColorExports);
  var _isHSL = _interopRequireDefault2(isHSLExports);
  var _isISRC = _interopRequireDefault2(isISRCExports);
  var _isIBAN = _interopRequireWildcard2(isIBAN$1);
  var _isBIC = _interopRequireDefault2(isBICExports);
  var _isMD = _interopRequireDefault2(isMD5Exports);
  var _isHash = _interopRequireDefault2(isHashExports);
  var _isJWT = _interopRequireDefault2(isJWTExports);
  var _isJSON = _interopRequireDefault2(isJSONExports);
  var _isEmpty = _interopRequireDefault2(isEmptyExports);
  var _isLength = _interopRequireDefault2(isLengthExports);
  var _isByteLength = _interopRequireDefault2(isByteLengthExports);
  var _isUUID = _interopRequireDefault2(isUUIDExports);
  var _isMongoId = _interopRequireDefault2(isMongoIdExports);
  var _isAfter = _interopRequireDefault2(isAfterExports);
  var _isBefore = _interopRequireDefault2(isBeforeExports);
  var _isIn = _interopRequireDefault2(isInExports);
  var _isLuhnNumber = _interopRequireDefault2(isLuhnNumberExports);
  var _isCreditCard = _interopRequireDefault2(isCreditCardExports);
  var _isIdentityCard = _interopRequireDefault2(isIdentityCardExports);
  var _isEAN = _interopRequireDefault2(isEANExports);
  var _isISIN = _interopRequireDefault2(isISINExports);
  var _isISBN = _interopRequireDefault2(isISBNExports);
  var _isISSN = _interopRequireDefault2(isISSNExports);
  var _isTaxID = _interopRequireDefault2(isTaxIDExports);
  var _isMobilePhone = _interopRequireWildcard2(isMobilePhone$1);
  var _isEthereumAddress = _interopRequireDefault2(isEthereumAddressExports);
  var _isCurrency = _interopRequireDefault2(isCurrencyExports);
  var _isBtcAddress = _interopRequireDefault2(isBtcAddressExports);
  var _isISO = _interopRequireDefault2(isISO6391Exports);
  var _isISO2 = _interopRequireDefault2(isISO8601Exports);
  var _isRFC = _interopRequireDefault2(isRFC3339Exports);
  var _isISO31661Alpha = _interopRequireDefault2(isISO31661Alpha2$1);
  var _isISO31661Alpha2 = _interopRequireDefault2(isISO31661Alpha3Exports);
  var _isISO3 = _interopRequireDefault2(isISO4217$1);
  var _isBase = _interopRequireDefault2(isBase32Exports);
  var _isBase2 = _interopRequireDefault2(isBase58Exports);
  var _isBase3 = _interopRequireDefault2(isBase64Exports);
  var _isDataURI = _interopRequireDefault2(isDataURIExports);
  var _isMagnetURI = _interopRequireDefault2(isMagnetURIExports);
  var _isMimeType = _interopRequireDefault2(isMimeTypeExports);
  var _isLatLong = _interopRequireDefault2(isLatLongExports);
  var _isPostalCode = _interopRequireWildcard2(isPostalCode$1);
  var _ltrim = _interopRequireDefault2(ltrimExports);
  var _rtrim = _interopRequireDefault2(rtrimExports);
  var _trim = _interopRequireDefault2(trimExports);
  var _escape2 = _interopRequireDefault2(_escapeExports);
  var _unescape2 = _interopRequireDefault2(_unescapeExports);
  var _stripLow = _interopRequireDefault2(stripLowExports);
  var _whitelist = _interopRequireDefault2(whitelistExports);
  var _blacklist = _interopRequireDefault2(blacklistExports);
  var _isWhitelisted = _interopRequireDefault2(isWhitelistedExports);
  var _normalizeEmail = _interopRequireDefault2(normalizeEmailExports);
  var _isSlug = _interopRequireDefault2(isSlugExports);
  var _isLicensePlate = _interopRequireDefault2(isLicensePlateExports);
  var _isStrongPassword = _interopRequireDefault2(isStrongPasswordExports);
  var _isVAT = _interopRequireDefault2(isVAT$1);
  function _getRequireWildcardCache2() {
    if (typeof WeakMap !== "function")
      return null;
    var cache = /* @__PURE__ */ new WeakMap();
    _getRequireWildcardCache2 = function _getRequireWildcardCache3() {
      return cache;
    };
    return cache;
  }
  function _interopRequireWildcard2(obj) {
    if (obj && obj.__esModule) {
      return obj;
    }
    if (obj === null || _typeof2(obj) !== "object" && typeof obj !== "function") {
      return { default: obj };
    }
    var cache = _getRequireWildcardCache2();
    if (cache && cache.has(obj)) {
      return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj[key];
        }
      }
    }
    newObj.default = obj;
    if (cache) {
      cache.set(obj, newObj);
    }
    return newObj;
  }
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var version2 = "13.9.0";
  var validator2 = {
    version: version2,
    toDate: _toDate.default,
    toFloat: _toFloat.default,
    toInt: _toInt.default,
    toBoolean: _toBoolean.default,
    equals: _equals.default,
    contains: _contains.default,
    matches: _matches.default,
    isEmail: _isEmail.default,
    isURL: _isURL.default,
    isMACAddress: _isMACAddress.default,
    isIP: _isIP.default,
    isIPRange: _isIPRange.default,
    isFQDN: _isFQDN.default,
    isBoolean: _isBoolean.default,
    isIBAN: _isIBAN.default,
    isBIC: _isBIC.default,
    isAlpha: _isAlpha.default,
    isAlphaLocales: _isAlpha.locales,
    isAlphanumeric: _isAlphanumeric.default,
    isAlphanumericLocales: _isAlphanumeric.locales,
    isNumeric: _isNumeric.default,
    isPassportNumber: _isPassportNumber.default,
    isPort: _isPort.default,
    isLowercase: _isLowercase.default,
    isUppercase: _isUppercase.default,
    isAscii: _isAscii.default,
    isFullWidth: _isFullWidth.default,
    isHalfWidth: _isHalfWidth.default,
    isVariableWidth: _isVariableWidth.default,
    isMultibyte: _isMultibyte.default,
    isSemVer: _isSemVer.default,
    isSurrogatePair: _isSurrogatePair.default,
    isInt: _isInt.default,
    isIMEI: _isIMEI.default,
    isFloat: _isFloat.default,
    isFloatLocales: _isFloat.locales,
    isDecimal: _isDecimal.default,
    isHexadecimal: _isHexadecimal.default,
    isOctal: _isOctal.default,
    isDivisibleBy: _isDivisibleBy.default,
    isHexColor: _isHexColor.default,
    isRgbColor: _isRgbColor.default,
    isHSL: _isHSL.default,
    isISRC: _isISRC.default,
    isMD5: _isMD.default,
    isHash: _isHash.default,
    isJWT: _isJWT.default,
    isJSON: _isJSON.default,
    isEmpty: _isEmpty.default,
    isLength: _isLength.default,
    isLocale: _isLocale.default,
    isByteLength: _isByteLength.default,
    isUUID: _isUUID.default,
    isMongoId: _isMongoId.default,
    isAfter: _isAfter.default,
    isBefore: _isBefore.default,
    isIn: _isIn.default,
    isLuhnNumber: _isLuhnNumber.default,
    isCreditCard: _isCreditCard.default,
    isIdentityCard: _isIdentityCard.default,
    isEAN: _isEAN.default,
    isISIN: _isISIN.default,
    isISBN: _isISBN.default,
    isISSN: _isISSN.default,
    isMobilePhone: _isMobilePhone.default,
    isMobilePhoneLocales: _isMobilePhone.locales,
    isPostalCode: _isPostalCode.default,
    isPostalCodeLocales: _isPostalCode.locales,
    isEthereumAddress: _isEthereumAddress.default,
    isCurrency: _isCurrency.default,
    isBtcAddress: _isBtcAddress.default,
    isISO6391: _isISO.default,
    isISO8601: _isISO2.default,
    isRFC3339: _isRFC.default,
    isISO31661Alpha2: _isISO31661Alpha.default,
    isISO31661Alpha3: _isISO31661Alpha2.default,
    isISO4217: _isISO3.default,
    isBase32: _isBase.default,
    isBase58: _isBase2.default,
    isBase64: _isBase3.default,
    isDataURI: _isDataURI.default,
    isMagnetURI: _isMagnetURI.default,
    isMimeType: _isMimeType.default,
    isLatLong: _isLatLong.default,
    ltrim: _ltrim.default,
    rtrim: _rtrim.default,
    trim: _trim.default,
    escape: _escape2.default,
    unescape: _unescape2.default,
    stripLow: _stripLow.default,
    whitelist: _whitelist.default,
    blacklist: _blacklist.default,
    isWhitelisted: _isWhitelisted.default,
    normalizeEmail: _normalizeEmail.default,
    toString,
    isSlug: _isSlug.default,
    isStrongPassword: _isStrongPassword.default,
    isTaxID: _isTaxID.default,
    isDate: _isDate.default,
    isTime: _isTime.default,
    isLicensePlate: _isLicensePlate.default,
    isVAT: _isVAT.default,
    ibanLocales: _isIBAN.locales
  };
  var _default = validator2;
  exports.default = _default;
  module.exports = exports.default;
  module.exports.default = exports.default;
})(validator, validatorExports);
const CreateAccount_vue_vue_type_style_index_0_lang = "";
const _hoisted_1 = { class: "container" };
const _hoisted_2 = { class: "rounded border border-primary border-2 border-opacity-25 py-3 px-5" };
const _hoisted_3 = { class: "d-flex flex-column" };
const _hoisted_4 = /* @__PURE__ */ createBaseVNode("legend", { class: "text-center" }, "Create Account", -1);
const _hoisted_5 = {
  id: "images",
  class: "row"
};
const _hoisted_6 = { id: "fig1" };
const _hoisted_7 = /* @__PURE__ */ createBaseVNode("img", { id: "preview-img" }, null, -1);
const _hoisted_8 = /* @__PURE__ */ createBaseVNode("label", null, "Image Preview", -1);
const _hoisted_9 = { class: "form-floating mb-2" };
const _hoisted_10 = /* @__PURE__ */ createBaseVNode("label", {
  for: "username",
  class: "form-label"
}, "Username", -1);
const _hoisted_11 = { class: "form-floating mb-2" };
const _hoisted_12 = /* @__PURE__ */ createBaseVNode("label", {
  for: "email",
  class: "form-label"
}, "Email", -1);
const _hoisted_13 = { class: "form-floating mb-2" };
const _hoisted_14 = /* @__PURE__ */ createBaseVNode("label", {
  for: "phone",
  class: "form-label"
}, "Phone Number", -1);
const _hoisted_15 = {
  ref: "phoneErrorRef",
  class: "text-danger"
};
const _hoisted_16 = { class: "form-floating mb-2" };
const _hoisted_17 = /* @__PURE__ */ createBaseVNode("label", {
  for: "password",
  class: "form-label"
}, "Password", -1);
const _hoisted_18 = { class: "form-floating mb-2" };
const _hoisted_19 = /* @__PURE__ */ createBaseVNode("label", {
  for: "password2",
  class: "form-label"
}, "Reenter password", -1);
const _hoisted_20 = { class: "mb-2" };
const _hoisted_21 = /* @__PURE__ */ createBaseVNode("label", {
  for: "avatar",
  class: "form-label"
}, "Choose a profile picture:", -1);
const _hoisted_22 = ["disabled"];
const _sfc_main$1 = {
  __name: "CreateAccount",
  setup(__props) {
    const usernameRef = ref(null);
    const username = ref("");
    const password = ref("");
    const password2 = ref("");
    const disabled = ref(true);
    const email = ref("");
    const emailRef = ref(null);
    const phone = ref("");
    const phoneRef = ref(null);
    const validPhone = ref(false);
    const validEmail = ref(false);
    const avatarImageFile = reactive({ avatarImageFile: {} });
    const validUsername = ref(false);
    const validPassword = ref(false);
    const passwordsMatch = ref(false);
    const usernameErrorRef = ref(null);
    const emailErrorRef = ref(null);
    const passwordErrorRef = ref(null);
    const password2ErrorRef = ref(null);
    let count = 0;
    function checkEmail(str) {
      return validatorExports.isEmail(str);
    }
    function checkPhone(str) {
      return validatorExports.isMobilePhone(str, "en-US");
    }
    function checkPassword(str) {
      return validatorExports.isStrongPassword(str);
    }
    watch(usernameRef, () => {
      console.log("watching usernameRef");
      console.log(usernameRef.value);
      console.log(count++);
      usernameRef.value.value = "alewis";
    });
    watch(emailRef, () => {
      console.log("watching emailRef");
      console.log(emailRef.value);
      console.log(count++);
      emailRef.value.value = "alewis3@eagles.bridgewater.edu";
    });
    function loadPreviewImg(evt) {
      avatarImageFile.avatarImageFile = evt.target.files[0];
      let reader = new FileReader();
      reader.onloadend = function() {
        let img = document.querySelector("#preview-img");
        img.src = reader.result;
      };
      reader.readAsDataURL(avatarImageFile.avatarImageFile);
    }
    function componentUpdate(elm) {
      console.log("password changed");
      console.log(elm.value);
      console.log(passwordErrorRef.value);
      if (passwordErrorRef.value != null && elm.value.length > 0) {
        if (checkPassword(password.value) !== false) {
          validPassword.value = password.value;
        }
        passwordErrorRef.value.innerHTML = validPassword.value ? "&nbsp;" : "Minimum length: 8 characters, at least one upper and lowercase letter, at least one number, and atleast 1 special character(ex.@#!)";
      }
    }
    watch(username, () => {
      validUsername.value = username.value.length >= 4;
      usernameErrorRef.value.innerHTML = validUsername.value ? "&nbsp;" : "Minimum length: 4 characters";
      usernameRef.value.setAttribute("data", "hello");
    });
    watch(email, () => {
      if (checkEmail(email.value) === true) {
        validEmail.value = email.value;
      }
      emailErrorRef.value.innerHTML = validEmail.value ? "&nbsp;" : "Please enter a valid email address";
      emailRef.value.setAttribute("data", "hello");
    });
    watch(phone, () => {
      if (checkPhone(phone.value) === true) {
        validPhone.value = phone.value;
      }
      phoneErrorRef.value.innerHTML = validPhone.value ? "&nbsp;" : "Please enter a valid phone number";
      phoneRef.value.setAttribute("data", "hello");
    });
    watch([password, password2], () => {
      passwordsMatch.value = password.value === password2.value;
      password2ErrorRef.value.innerHTML = passwordsMatch.value || password2.value.length == 0 ? "&nbsp;" : "Passwords do not match";
    });
    watch(
      [validUsername, validPassword, passwordsMatch, validEmail, validPhone],
      async () => {
        disabled.value = !(validUsername.value && validPassword.value && passwordsMatch.value && validEmail.value && validPhone.value);
        console.log(disabled.value);
        if (!disabled.value)
          usernameRef.value.value = "";
      }
    );
    function submit() {
      let mssg = username.value + ", " + password.value;
      console.log(mssg);
    }
    onMounted(() => {
      usernameRef.value.focus();
    });
    onUpdated(() => {
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("form", _hoisted_2, [
          createBaseVNode("fieldset", _hoisted_3, [
            _hoisted_4,
            createBaseVNode("div", _hoisted_5, [
              createBaseVNode("div", null, [
                createBaseVNode("figure", _hoisted_6, [
                  _hoisted_7,
                  createBaseVNode("figcaption", null, toDisplayString(avatarImageFile.avatarImageFile.null), 1),
                  _hoisted_8
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_9, [
              withDirectives(createBaseVNode("input", {
                ref_key: "usernameRef",
                ref: usernameRef,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => username.value = $event),
                id: "username",
                type: "text",
                class: "form-control"
              }, null, 512), [
                [vModelText, username.value]
              ]),
              _hoisted_10,
              createBaseVNode("small", {
                ref_key: "usernameErrorRef",
                ref: usernameErrorRef,
                class: "text-danger"
              }, " ", 512)
            ]),
            createBaseVNode("div", _hoisted_11, [
              withDirectives(createBaseVNode("input", {
                ref_key: "emailRef",
                ref: emailRef,
                type: "email",
                id: "email",
                class: "form-control",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => email.value = $event)
              }, null, 512), [
                [vModelText, email.value]
              ]),
              _hoisted_12,
              createBaseVNode("small", {
                ref_key: "emailErrorRef",
                ref: emailErrorRef,
                class: "text-danger"
              }, " ", 512)
            ]),
            createBaseVNode("div", _hoisted_13, [
              withDirectives(createBaseVNode("input", {
                ref_key: "phoneRef",
                ref: phoneRef,
                type: "tel",
                id: "phone",
                class: "form-control",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => phone.value = $event)
              }, null, 512), [
                [vModelText, phone.value]
              ]),
              _hoisted_14,
              createBaseVNode("small", _hoisted_15, " ", 512)
            ]),
            createBaseVNode("div", _hoisted_16, [
              withDirectives(createBaseVNode("input", {
                ref: componentUpdate,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => password.value = $event),
                id: "password",
                type: "password",
                class: "form-control"
              }, null, 512), [
                [vModelText, password.value]
              ]),
              _hoisted_17,
              createBaseVNode("small", {
                ref_key: "passwordErrorRef",
                ref: passwordErrorRef,
                class: "text-danger"
              }, " ", 512)
            ]),
            createBaseVNode("div", _hoisted_18, [
              withDirectives(createBaseVNode("input", {
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => password2.value = $event),
                id: "password2",
                type: "password",
                class: "form-control"
              }, null, 512), [
                [vModelText, password2.value]
              ]),
              _hoisted_19,
              createBaseVNode("small", {
                ref_key: "password2ErrorRef",
                ref: password2ErrorRef,
                class: "text-danger"
              }, " ", 512)
            ]),
            createBaseVNode("div", _hoisted_20, [
              _hoisted_21,
              createBaseVNode("input", {
                id: "avatar",
                class: "form-control",
                type: "file",
                name: "avatar",
                accept: "image/png, image/jpeg",
                onChange: loadPreviewImg
              }, null, 32)
            ]),
            createBaseVNode("div", null, [
              createBaseVNode("button", {
                onClick: submit,
                class: "btn btn-primary",
                type: "button",
                disabled: disabled.value
              }, " Create Account ", 8, _hoisted_22)
            ])
          ])
        ])
      ]);
    };
  }
};
const App_vue_vue_type_style_index_0_lang = "";
const _sfc_main = {
  __name: "App",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("main", null, [
        createBaseVNode("div", null, [
          createVNode(_sfc_main$1)
        ])
      ]);
    };
  }
};
const main = "";
createApp(_sfc_main).mount("#app");

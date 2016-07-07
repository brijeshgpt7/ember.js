/**
@module ember-metal
*/

const FUNCTION_META_FIELD = '__ember_function_meta__';

function ROOT_WRAPPED_FUNCTION () { }
let ROOT_WRAPPED_FUNCTION_META;

function FunctionMeta(func, wrappedFunctionMeta) {
  this._beforeObservers = undefined;
  this._observers = undefined;
  this._listeners = undefined;
  this._hasSuper = undefined;

  // used only internally
  this.source = func;

  // The function that we are wrapping
  this.wrappedFunctionMeta = wrappedFunctionMeta || ROOT_WRAPPED_FUNCTION_META;
}

FunctionMeta.prototype.hasWrappedFunction = function hasWrappedFunction() {
  return this.wrappedFunctionMeta !== ROOT_WRAPPED_FUNCTION_META;
};

FunctionMeta.prototype.peekHasSuper = function hasSuper() {
  return this._hasSuper;
};

FunctionMeta.prototype.writeHasSuper = function(value) {
  this._hasSuper = value;
};

FunctionMeta.prototype.peekBeforeObservers = function peekBeforeObservers() {
  return this._getInherited('_beforeObservers');
};

FunctionMeta.prototype.writeBeforeObservers = function writeBeforeObservers(value) {
  this._beforeObservers = value;
};

FunctionMeta.prototype.peekObservers = function peekObservers() {
  return this._getInherited('_observers');
};

FunctionMeta.prototype.writeObservers = function writeObservers(value) {
  this._observers = value;
};

FunctionMeta.prototype.peekListeners = function peekListeners() {
  return this._getInherited('_listeners');
};

FunctionMeta.prototype.writeListeners = function writeListeners(value) {
  this._listeners = value;
};

FunctionMeta.prototype._getInherited = function(key) {
  let pointer = this;
  while (pointer !== undefined) {
    if (pointer[key] !== undefined) {
      return pointer[key];
    }
    pointer = pointer.wrappedFunctionMeta;
  }
};

function buildRootWrappedFunction() {
  let meta = new FunctionMeta(ROOT_WRAPPED_FUNCTION);

  meta.writeBeforeObservers([]);
  meta.writeObservers([]);
  meta.writeListeners([]);

  return meta;
}

// setup shared wrapped function
ROOT_WRAPPED_FUNCTION_META = buildRootWrappedFunction();

function setFunctionMeta(obj, meta) {
  obj[FUNCTION_META_FIELD] = meta;
}

export function peekFunctionMeta(obj) {
  return obj[FUNCTION_META_FIELD];
}

export function deleteFunctionMeta(obj) {
  obj[FUNCTION_META_FIELD] = null;
}

/**
  Retrieves the meta hash for a function.

  A functions meta object contains information about observers, listeners,
  if a function has been super wrapped, etc.

  @method functionMetaFor
  @private

  @param {Object} obj The object to retrieve meta for
  @return {Object} the meta hash for an object
*/
export function functionMetaFor(func, wrappedFunctionMeta) {
  let maybeMeta = peekFunctionMeta(func);
  if (maybeMeta) { return maybeMeta; }

  let newMeta = new FunctionMeta(func, wrappedFunctionMeta);
  setFunctionMeta(func, newMeta);

  return newMeta;
}
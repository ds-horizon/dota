"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorToDatadog = exports.addDataDogTagsToSpan = exports.getSpanId = exports.getTraceId = void 0;
const dd_trace_1 = require("dd-trace");
dd_trace_1.default.init();
exports.default = dd_trace_1.default;
const getTraceId = () => {
    const span = dd_trace_1.default.scope().active();
    return span ? span.context().toTraceId() : undefined;
};
exports.getTraceId = getTraceId;
const getSpanId = () => {
    const span = dd_trace_1.default.scope().active();
    return span ? span.context().toSpanId() : undefined;
};
exports.getSpanId = getSpanId;
const addDataDogTagsToSpan = (kv) => {
    const span = dd_trace_1.default.scope().active();
    if (span) {
        span.addTags(kv);
    }
};
exports.addDataDogTagsToSpan = addDataDogTagsToSpan;
const sendErrorToDatadog = (err) => {
    try {
        (0, exports.addDataDogTagsToSpan)({
            'error.msg': err.message,
            'error.type': err.name,
            'error.stack': err.stack
        });
    }
    catch (loggingError) {
        console.log('Failed to send error to Datadog:', loggingError);
    }
};
exports.sendErrorToDatadog = sendErrorToDatadog;

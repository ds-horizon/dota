"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const security = require("../script/utils/security");
describe("Security Features", () => {
    it("do not allow accessKey from starting with '-'", () => {
        var accountId = "DummyAccnt1";
        for (var i = 0; i < 10; i++) {
            var accessKey = security.generateSecureKey(accountId);
            assert.notEqual("-", accessKey.charAt(0));
        }
    });
});

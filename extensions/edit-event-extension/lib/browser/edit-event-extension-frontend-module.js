"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var edit_event_extension_contribution_1 = require("./edit-event-extension-contribution");
var common_1 = require("@theia/core/lib/common");
var inversify_1 = require("inversify");
exports.default = new inversify_1.ContainerModule(function (bind) {
    // add your contribution bindings here
    bind(common_1.CommandContribution).to(edit_event_extension_contribution_1.EditEventExtensionCommandContribution);
});
//# sourceMappingURL=edit-event-extension-frontend-module.js.map
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var common_1 = require("@theia/core/lib/common");
var monaco_workspace_1 = require("@theia/monaco/lib/browser/monaco-workspace");
var uri_1 = require("@theia/core/lib/common/uri");
var file_resource_1 = require("@theia/filesystem/lib/browser/file-resource");
var filesystem_watcher_1 = require("@theia/filesystem/lib/browser/filesystem-watcher");
var common_2 = require("@theia/filesystem/lib/common");
var monaco_text_model_service_1 = require("@theia/monaco/lib/browser/monaco-text-model-service");
//import { TextDocument, Range } from '@theia/languages/lib/browser'
var socketIO = require("socket.io-client");
exports.EditEventExtensionCommand = {
    id: 'EditEventExtension.command',
    label: 'Listens to edits',
};
var EditEventExtensionCommandContribution = /** @class */ (function () {
    function EditEventExtensionCommandContribution(messageService, monacoWorkspace, fileSystem, watcher, monacoDocRetriever) {
        var _this = this;
        this.messageService = messageService;
        this.monacoWorkspace = monacoWorkspace;
        this.fileSystem = fileSystem;
        this.watcher = watcher;
        this.monacoDocRetriever = monacoDocRetriever;
        var sSocket = socketIO('http://localhost:8888');
        var rSocket = socketIO('http://localhost:8888');
        this.edits = [];
        rSocket.on('update', function (edit) {
            var editStr = JSON.stringify(edit);
            var index;
            if ((index = _this.edits.indexOf(editStr)) !== -1) {
                console.log('found edit');
                _this.edits.splice(index, 1);
            }
            else {
                console.log('applying edit!');
                _this.applyEdit(edit);
            }
        });
        monacoWorkspace.onDidChangeTextDocument(function (event) {
            event.contentChanges.forEach(function (e) {
                var edit = __assign({}, e, { 'uri': event.textDocument.uri });
                _this.edits.push(JSON.stringify(edit));
                sSocket.emit('update', edit);
            });
        });
    }
    EditEventExtensionCommandContribution.prototype.registerCommands = function (registry) {
        var _this = this;
        registry.registerCommand(exports.EditEventExtensionCommand, {
            execute: function () { return _this.messageService.info('Hello Thdaar World!'); }
        });
    };
    EditEventExtensionCommandContribution.prototype.createFile = function (fileURI) {
        var newFile = fileURI || 'file:///Users/lem0n/Desktop/theia-edit-extension-example/edit-event-extension/src/browser/test.ts';
        var newUri = new uri_1.default(newFile);
        var fr = new file_resource_1.FileResource(newUri, this.fileSystem, this.watcher);
        fr.saveContents('kys');
    };
    EditEventExtensionCommandContribution.prototype.attachListeners = function () {
    };
    EditEventExtensionCommandContribution.prototype.applyEdit = function (msg) {
        var doc = this.monacoDocRetriever.get(msg.uri);
        if (typeof doc === 'undefined') {
            return;
        }
        this.monacoWorkspace.applyEdit({
            documentChanges: [{
                    textDocument: doc,
                    edits: [{
                            range: msg.range,
                            newText: msg.text,
                        }]
                }]
        });
    };
    EditEventExtensionCommandContribution = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(common_1.MessageService)),
        __param(1, inversify_1.inject(monaco_workspace_1.MonacoWorkspace)),
        __param(2, inversify_1.inject(common_2.FileSystem)),
        __param(3, inversify_1.inject(filesystem_watcher_1.FileSystemWatcher)),
        __param(4, inversify_1.inject(monaco_text_model_service_1.MonacoTextModelService)),
        __metadata("design:paramtypes", [common_1.MessageService,
            monaco_workspace_1.MonacoWorkspace, Object, filesystem_watcher_1.FileSystemWatcher,
            monaco_text_model_service_1.MonacoTextModelService])
    ], EditEventExtensionCommandContribution);
    return EditEventExtensionCommandContribution;
}());
exports.EditEventExtensionCommandContribution = EditEventExtensionCommandContribution;
//class EditInfo {
//  textDocument!: TextDocument
//  range: Range
//  text!: string
//
//  constructor(object: any) {
//    this.textDocument = object.textDocument
//    this.range = object.range
//    this.text = object.text
//  }
//}
// documentChanges: [{
//   textDocument: event.textDocument,
//   edits: [{
//     range: {
//       start: { line: 0, character: 0 },
//       end: { line: 0, character: 0},
//     },
//     newText: 'asfd',
//   }]
// }]
//# sourceMappingURL=edit-event-extension-contribution.js.map
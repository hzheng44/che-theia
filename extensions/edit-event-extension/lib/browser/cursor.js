"use strict";
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
var monaco_editor_provider_1 = require("@theia/monaco/lib/browser/monaco-editor-provider");
//import { MonacoEditor } from '@theia/monaco/lib/browser/monaco-editor';
var uri_1 = require("@theia/core/lib/common/uri");
var file_resource_1 = require("@theia/filesystem/lib/browser/file-resource");
var filesystem_watcher_1 = require("@theia/filesystem/lib/browser/filesystem-watcher");
var common_2 = require("@theia/filesystem/lib/common");
var browser_1 = require("@theia/editor/lib/browser");
exports.EditEventExtensionCommand = {
    id: 'EditEventExtension.command',
    label: "Shows a message"
};
var EditEventExtensionCommandContribution = /** @class */ (function () {
    function EditEventExtensionCommandContribution(messageService, monacoWorkspace, monacoEditorProvider, fileSystem, watcher, editorManager) {
        this.messageService = messageService;
        this.fileSystem = fileSystem;
        this.watcher = watcher;
        this.editorManager = editorManager;
        monacoWorkspace.onDidChangeTextDocument(function (event) {
            console.log(event.textDocument.uri);
            event.contentChanges.forEach(function (e) {
                console.log(e);
            });
        });
        // cursor 2
        // const mEditor = MonacoEditor.get(editorManager.currentEditor) // undefined
        // mEditor!.onCursorPositionChanged(event => {
        //   console.log('cursor')
        //   console.log('pls' + event)
        // })
        // cursor 1
        // const uri = new URI('file:///Users/lem0n/Desktop/theia-edit-extension-example/edit-event-extension/src/browser/edit-event-extension-contribution.ts')
        // monacoEditorProvider!.get(uri)
        //  .then((editor: MonacoEditor) => {
        //    console.log('editor' + editor)
        //    editor.onCursorPositionChanged(event => {
        //      console.log('cursor')
        //      console.log(Object.keys(event))
        //    })
        //  })
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
    EditEventExtensionCommandContribution = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(common_1.MessageService)),
        __param(1, inversify_1.inject(monaco_workspace_1.MonacoWorkspace)),
        __param(2, inversify_1.inject(monaco_editor_provider_1.MonacoEditorProvider)),
        __param(3, inversify_1.inject(common_2.FileSystem)),
        __param(4, inversify_1.inject(filesystem_watcher_1.FileSystemWatcher)),
        __param(5, inversify_1.inject(browser_1.EditorManager)),
        __metadata("design:paramtypes", [common_1.MessageService,
            monaco_workspace_1.MonacoWorkspace,
            monaco_editor_provider_1.MonacoEditorProvider, Object, filesystem_watcher_1.FileSystemWatcher,
            browser_1.EditorManager])
    ], EditEventExtensionCommandContribution);
    return EditEventExtensionCommandContribution;
}());
exports.EditEventExtensionCommandContribution = EditEventExtensionCommandContribution;
// applyedit code
//              monacoWorkspace.applyEdit({
//                documentChanges: [{
//                  textDocument: event.textDocument,
//                  edits: [{
//                    range: {
//                      start: { line: 0, character: 0 },
//                      end: { line: 0, character: 0},
//                    },
//                    newText: 'asfd',
//                  }]
//                }]
//              })
//# sourceMappingURL=cursor.js.map
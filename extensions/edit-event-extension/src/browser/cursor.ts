import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry,  MessageService } from "@theia/core/lib/common";
import { MonacoWorkspace } from "@theia/monaco/lib/browser/monaco-workspace";
import { MonacoEditorProvider } from '@theia/monaco/lib/browser/monaco-editor-provider';
//import { MonacoEditor } from '@theia/monaco/lib/browser/monaco-editor';
import URI from '@theia/core/lib/common/uri';
import { FileResource } from '@theia/filesystem/lib/browser/file-resource';
import { FileSystemWatcher } from '@theia/filesystem/lib/browser/filesystem-watcher';
import { FileSystem } from '@theia/filesystem/lib/common';
import { EditorManager } from '@theia/editor/lib/browser';


export const EditEventExtensionCommand = {
    id: 'EditEventExtension.command',
    label: "Shows a message"
};

@injectable()
export class EditEventExtensionCommandContribution implements CommandContribution {
    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
        @inject(MonacoWorkspace) monacoWorkspace: MonacoWorkspace,
        @inject(MonacoEditorProvider) monacoEditorProvider: MonacoEditorProvider,
        @inject(FileSystem) protected readonly fileSystem: FileSystem,
        @inject(FileSystemWatcher) protected readonly watcher: FileSystemWatcher,
        @inject(EditorManager) protected readonly editorManager: EditorManager,
    ) {
      monacoWorkspace.onDidChangeTextDocument(event => {
        console.log(event.textDocument.uri)
        event.contentChanges.forEach(e => {
            console.log(e)
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

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(EditEventExtensionCommand, {
            execute: () => this.messageService.info('Hello Thdaar World!')
        });
    }

    createFile(fileURI: string): void {
      const newFile = fileURI || 'file:///Users/lem0n/Desktop/theia-edit-extension-example/edit-event-extension/src/browser/test.ts'
      const newUri = new URI(newFile)
      const fr = new FileResource(newUri, this.fileSystem, this.watcher)
      fr.saveContents('kys')
    }
}

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

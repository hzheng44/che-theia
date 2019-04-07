import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry,  MessageService } from "@theia/core/lib/common";
import { MonacoWorkspace } from "@theia/monaco/lib/browser/monaco-workspace";
import URI from '@theia/core/lib/common/uri';
import { FileResource } from '@theia/filesystem/lib/browser/file-resource';
import { FileSystemWatcher } from '@theia/filesystem/lib/browser/filesystem-watcher';
import { FileSystem } from '@theia/filesystem/lib/common';
import { MonacoTextModelService } from '@theia/monaco/lib/browser/monaco-text-model-service';
import * as socketIO from 'socket.io-client'


export const EditEventExtensionCommand = {
    id: 'EditEventExtension.command',
    label: 'Listens to edits',
};

@injectable()
export class EditEventExtensionCommandContribution implements CommandContribution {
    private edits: string[]
    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
        @inject(MonacoWorkspace) protected readonly monacoWorkspace: MonacoWorkspace,
        @inject(FileSystem) protected readonly fileSystem: FileSystem,
        @inject(FileSystemWatcher) protected readonly watcher: FileSystemWatcher,
        @inject(MonacoTextModelService) protected monacoDocRetriever: MonacoTextModelService,
    ) {
      var sSocket = socketIO('http://localhost:8888')
      var rSocket = socketIO('http://localhost:8888')
      this.edits = []

      // receiving socket
      rSocket.on('update', (edit: any) => {
        const editStr = JSON.stringify(edit)
        var index
        if ((index = this.edits.indexOf(editStr)) === -1) {
          this.applyEdit(edit)
        } else {
          this.edits.splice(index, 1)
        }
      })

      // attach event listener
      monacoWorkspace.onDidChangeTextDocument(event => {
        event.contentChanges.forEach(e => {
          var edit = {...e, ...{'uri': event.textDocument.uri}}
          this.edits.push(JSON.stringify(edit))
          sSocket.emit('update', edit)
        });
      });
    }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(EditEventExtensionCommand, {
            execute: () => this.messageService.info('Hello Thdaar World!')
        });
    }

    // waiting on file swap code before using this
    createFile(fileURI: string): void {
      const newFile = fileURI || 'file:///Users/lem0n/Desktop/theia-edit-extension-example/edit-event-extension/src/browser/test.ts'
      const newUri = new URI(newFile)
      const fr = new FileResource(newUri, this.fileSystem, this.watcher)
      fr.saveContents('sample text')
    }

    applyEdit(msg: any) {
      const doc = this.monacoDocRetriever.get(msg.uri)
      if (typeof doc === 'undefined') {
        return
      }
      this.monacoWorkspace.applyEdit({
        documentChanges: [{
          textDocument: doc,
          edits: [{
            range: msg.range,
            newText: msg.text,
          }]
        }]
      })
    }
}

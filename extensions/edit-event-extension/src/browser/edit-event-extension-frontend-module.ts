import { EditEventExtensionCommandContribution } from './edit-event-extension-contribution';
import { CommandContribution } from "@theia/core/lib/common";

import { ContainerModule } from "inversify";

export default new ContainerModule(bind => {
    // add your contribution bindings here

    bind(CommandContribution).to(EditEventExtensionCommandContribution);
});

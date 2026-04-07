package run.halo.plugintemplate.setting;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PluginTemplateGeneralSetting {

    private Boolean enableConsoleDashboard = PluginTemplateSettingKeys.DEFAULT_ENABLE_CONSOLE_DASHBOARD;
    private Boolean enableUcDashboard = PluginTemplateSettingKeys.DEFAULT_ENABLE_UC_DASHBOARD;
    private Boolean enableAttachmentProvider = PluginTemplateSettingKeys.DEFAULT_ENABLE_ATTACHMENT_PROVIDER;

    public boolean isConsoleDashboardEnabled() {
        return !Boolean.FALSE.equals(enableConsoleDashboard);
    }

    public boolean isUcDashboardEnabled() {
        return !Boolean.FALSE.equals(enableUcDashboard);
    }

    public boolean isAttachmentProviderEnabled() {
        return !Boolean.FALSE.equals(enableAttachmentProvider);
    }
}

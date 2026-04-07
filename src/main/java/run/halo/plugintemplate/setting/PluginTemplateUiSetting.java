package run.halo.plugintemplate.setting;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PluginTemplateUiSetting {

    private String accentColor = PluginTemplateSettingKeys.DEFAULT_ACCENT_COLOR;
    private String density = PluginTemplateSettingKeys.DEFAULT_DENSITY;
    private String supportLink = PluginTemplateSettingKeys.DEFAULT_SUPPORT_LINK;
}

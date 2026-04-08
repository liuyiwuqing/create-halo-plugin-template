package run.halo.plugintemplate.scheme;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import run.halo.app.extension.AbstractExtension;
import run.halo.app.extension.GVK;
import run.halo.plugintemplate.setting.PluginTemplateSettingKeys;

@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@GVK(
    group = PluginTemplateSettingKeys.API_GROUP_SUFFIX,
    version = "v1alpha1",
    kind = "PluginTemplateRecord",
    plural = "pluginTemplateRecords",
    singular = "pluginTemplateRecord"
)
public class PluginTemplateRecord extends AbstractExtension {

    public static final String EXTENSION_NAME_PREFIX = "plugin-template-record-";

    @Schema(description = "业务主键", requiredMode = REQUIRED)
    private String id;

    @Schema(description = "标题", requiredMode = REQUIRED)
    private String title;

    @Schema(description = "描述")
    private String description;

    @Schema(description = "状态", requiredMode = REQUIRED)
    private String status;

    @Schema(description = "创建时间")
    private String createTime;

    @Schema(description = "更新时间")
    private String updateTime;
}

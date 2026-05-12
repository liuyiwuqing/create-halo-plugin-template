package run.halo.plugintemplate.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(name = "PluginTemplateRecordUpdateRequest", description = "示例数据记录更新请求")
public class PluginTemplateRecordUpdateRequest {

    @Schema(description = "标题", requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @Schema(description = "描述")
    private String description;

    @Schema(description = "状态", example = "draft")
    private String status;
}

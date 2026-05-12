package run.halo.plugintemplate.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(name = "PluginTemplateRecordCreateRequest", description = "示例数据记录创建请求")
public class PluginTemplateRecordCreateRequest {

    @Schema(description = "业务主键，留空时自动生成")
    private String id;

    @Schema(description = "标题", requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @Schema(description = "描述")
    private String description;

    @Schema(description = "状态", example = "draft")
    private String status;
}

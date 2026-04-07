package run.halo.plugintemplate.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "PluginTemplateChecklistItem", description = "模板初始化检查项")
public class PluginTemplateChecklistItem {

    @Schema(description = "检查项键")
    private String key;

    @Schema(description = "标题")
    private String title;

    @Schema(description = "说明")
    private String description;

    @Schema(description = "受众")
    private String audience;

    @Schema(description = "状态")
    private String status;
}

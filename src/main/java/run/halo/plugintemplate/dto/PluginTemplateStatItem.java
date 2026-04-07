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
@Schema(name = "PluginTemplateStatItem", description = "模板统计卡片")
public class PluginTemplateStatItem {

    @Schema(description = "统计项键")
    private String key;

    @Schema(description = "标题")
    private String label;

    @Schema(description = "值")
    private String value;

    @Schema(description = "提示")
    private String helper;

    @Schema(description = "视觉语义")
    private String tone;
}

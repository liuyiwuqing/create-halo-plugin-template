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
@Schema(name = "PluginTemplateFeatureItem", description = "模板功能项")
public class PluginTemplateFeatureItem {

    @Schema(description = "功能键")
    private String key;

    @Schema(description = "标题")
    private String title;

    @Schema(description = "区域")
    private String area;

    @Schema(description = "说明")
    private String description;

    @Schema(description = "是否默认启用")
    private Boolean enabled;
}

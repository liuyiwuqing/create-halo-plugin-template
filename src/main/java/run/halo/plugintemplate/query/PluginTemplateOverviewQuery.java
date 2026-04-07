package run.halo.plugintemplate.query;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "PluginTemplateOverviewQuery", description = "模板预留的查询参数对象")
public class PluginTemplateOverviewQuery {

    @Schema(description = "关键字")
    private String keyword;

    @Schema(description = "页码", example = "1")
    @Builder.Default
    private Integer page = 1;

    @Schema(description = "页大小", example = "10")
    @Builder.Default
    private Integer size = 10;
}

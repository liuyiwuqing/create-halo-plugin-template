package run.halo.plugintemplate.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "PluginTemplateOverview", description = "模板概览信息")
public class PluginTemplateOverview {

    @Schema(description = "插件名")
    private String pluginName;

    @Schema(description = "显示名")
    private String displayName;

    @Schema(description = "当前视角")
    private String audience;

    @Schema(description = "视角标签")
    private String audienceLabel;

    @Schema(description = "Console 路由")
    private String consolePath;

    @Schema(description = "UC 路由")
    private String ucPath;

    @Schema(description = "Setting 名称")
    private String settingName;

    @Schema(description = "ConfigMap 名称")
    private String configMapName;

    @Schema(description = "生成客户端输出目录")
    private String generatedClientPath;

    @Schema(description = "生成时间")
    private String generatedAt;

    @Schema(description = "是否启用 Console 页面")
    private Boolean enableConsoleDashboard;

    @Schema(description = "是否启用 UC 页面")
    private Boolean enableUcDashboard;

    @Schema(description = "是否启用附件扩展标签页")
    private Boolean enableAttachmentProvider;

    @Schema(description = "主色")
    private String accentColor;

    @Schema(description = "页面密度")
    private String density;

    @Schema(description = "支持文档链接")
    private String supportLink;

    @Schema(description = "统计信息")
    private List<PluginTemplateStatItem> stats;

    @Schema(description = "功能矩阵")
    private List<PluginTemplateFeatureItem> features;

    @Schema(description = "初始化清单")
    private List<PluginTemplateChecklistItem> checklist;
}

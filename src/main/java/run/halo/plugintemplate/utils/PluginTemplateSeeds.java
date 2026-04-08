package run.halo.plugintemplate.utils;

import java.util.List;
import run.halo.plugintemplate.dto.PluginTemplateChecklistItem;
import run.halo.plugintemplate.dto.PluginTemplateFeatureItem;
import run.halo.plugintemplate.dto.PluginTemplateOverview;
import run.halo.plugintemplate.dto.PluginTemplateStatItem;
import run.halo.plugintemplate.model.PluginTemplateAudience;
import run.halo.plugintemplate.setting.PluginTemplateGeneralSetting;
import run.halo.plugintemplate.setting.PluginTemplateSettingKeys;
import run.halo.plugintemplate.setting.PluginTemplateUiSetting;

public final class PluginTemplateSeeds {

    private PluginTemplateSeeds() {
    }

    public static PluginTemplateOverview buildOverview(
        PluginTemplateAudience audience,
        PluginTemplateGeneralSetting generalSetting,
        PluginTemplateUiSetting uiSetting,
        String generatedAt
    ) {
        return PluginTemplateOverview.builder()
            .pluginName(PluginTemplateSettingKeys.PLUGIN_NAME)
            .displayName(PluginTemplateSettingKeys.DISPLAY_NAME)
            .audience(audience.getCode())
            .audienceLabel(audience.getLabel())
            .consolePath(PluginTemplateSettingKeys.CONSOLE_PATH)
            .ucPath(PluginTemplateSettingKeys.UC_PATH)
            .settingName(PluginTemplateSettingKeys.SETTING_NAME)
            .configMapName(PluginTemplateSettingKeys.CONFIG_MAP_NAME)
            .generatedClientPath(PluginTemplateSettingKeys.GENERATED_CLIENT_PATH)
            .generatedAt(generatedAt)
            .enableConsoleDashboard(generalSetting.isConsoleDashboardEnabled())
            .enableUcDashboard(generalSetting.isUcDashboardEnabled())
            .enableAttachmentProvider(generalSetting.isAttachmentProviderEnabled())
            .accentColor(uiSetting.getAccentColor())
            .density(uiSetting.getDensity())
            .supportLink(uiSetting.getSupportLink())
            .stats(defaultStats(generalSetting, uiSetting))
            .features(defaultFeatures(generalSetting, uiSetting))
            .checklist(defaultChecklist(audience, generalSetting))
            .build();
    }

    private static List<PluginTemplateStatItem> defaultStats(
        PluginTemplateGeneralSetting generalSetting,
        PluginTemplateUiSetting uiSetting
    ) {
        var enabledRoutes = (generalSetting.isConsoleDashboardEnabled() ? 1 : 0)
            + (generalSetting.isUcDashboardEnabled() ? 1 : 0);
        var enabledExtensionPoints = (generalSetting.isConsoleDashboardEnabled() ? 2 : 0)
            + (generalSetting.isAttachmentProviderEnabled() ? 1 : 0);
        return List.of(
            PluginTemplateStatItem.builder()
                .key("routes")
                .label("已启用页面")
                .value(String.valueOf(enabledRoutes))
                .helper("Console / UC 入口会根据 settings.yaml 中的开关映射到模板概览。")
                .tone("primary")
                .build(),
            PluginTemplateStatItem.builder()
                .key("extension-points")
                .label("已启用扩展点")
                .value(String.valueOf(enabledExtensionPoints))
                .helper("仪表盘、快速操作和附件选择器状态由插件设置驱动。")
                .tone("success")
                .build(),
            PluginTemplateStatItem.builder()
                .key("ui-density")
                .label("UI 密度")
                .value(uiDensityLabel(uiSetting.getDensity()))
                .helper("PluginUiProvider 会把密度映射到 Element Plus 全局 size。")
                .tone("warning")
                .build()
        );
    }

    private static List<PluginTemplateFeatureItem> defaultFeatures(
        PluginTemplateGeneralSetting generalSetting,
        PluginTemplateUiSetting uiSetting
    ) {
        return List.of(
            PluginTemplateFeatureItem.builder()
                .key("console-route")
                .title("Console 路由")
                .area("UI")
                .description("带菜单元数据和权限元数据的后台入口。")
                .enabled(generalSetting.isConsoleDashboardEnabled())
                .build(),
            PluginTemplateFeatureItem.builder()
                .key("uc-route")
                .title("UC 路由")
                .area("UI")
                .description("面向个人中心的共享页面壳子。")
                .enabled(generalSetting.isUcDashboardEnabled())
                .build(),
            PluginTemplateFeatureItem.builder()
                .key("widget")
                .title("仪表盘小部件")
                .area("Extension Point")
                .description("示例小部件直接消费模板概览接口。")
                .enabled(generalSetting.isConsoleDashboardEnabled())
                .build(),
            PluginTemplateFeatureItem.builder()
                .key("quick-action")
                .title("快速操作")
                .area("Extension Point")
                .description("可一键跳转到模板默认 Console 页面。")
                .enabled(generalSetting.isConsoleDashboardEnabled())
                .build(),
            PluginTemplateFeatureItem.builder()
                .key("attachment-tab")
                .title("附件扩展标签页")
                .area("Extension Point")
                .description("示例附件来源，便于按需改造成图库、素材库或外链源。")
                .enabled(generalSetting.isAttachmentProviderEnabled())
                .build(),
            PluginTemplateFeatureItem.builder()
                .key("element-plus")
                .title("Element Plus 包装层")
                .area("UI")
                .description("低层组件集中在 ui/src/components/ui，并由 PluginUiProvider 同步主色和密度。")
                .enabled(true)
                .build(),
            PluginTemplateFeatureItem.builder()
                .key("openapi")
                .title("OpenAPI 生成链路")
                .area("Tooling")
                .description("概览 API 已接到生成客户端，新增接口后只需重新执行 generateApiClient。")
                .enabled(true)
                .build(),
            PluginTemplateFeatureItem.builder()
                .key("theme-settings")
                .title("设置驱动 UI")
                .area("Tooling")
                .description("当前模板会消费设置项中的主色、密度和支持链接。")
                .enabled(true)
                .build()
        );
    }

    private static List<PluginTemplateChecklistItem> defaultChecklist(
        PluginTemplateAudience audience,
        PluginTemplateGeneralSetting generalSetting
    ) {
        return List.of(
            PluginTemplateChecklistItem.builder()
                .key("init-script")
                .title("确认初始化结果")
                .description("通过 npm create 或 create-project 创建项目时，这一步已经自动完成；只有手工复制模板源码时，才需要单独运行初始化脚本。")
                .audience("all")
                .status("done")
                .build(),
            PluginTemplateChecklistItem.builder()
                .key("settings")
                .title("调整 settings.yaml")
                .description("只保留当前插件真实需要的配置项和表单分组。")
                .audience("all")
                .status("recommended")
                .build(),
            PluginTemplateChecklistItem.builder()
                .key("api-client")
                .title("生成前端 API 客户端")
                .description("补充接口后执行 ./gradlew generateApiClient，再在 ui/src/api/index.ts 暴露新增能力。")
                .audience("console")
                .status("recommended")
                .build(),
            PluginTemplateChecklistItem.builder()
                .key("uc-scope")
                .title("确认 UC 暴露面")
                .description("如果插件不需要 UC，可移除 ucRoutes 和对应 role 模板。")
                .audience("uc")
                .status(resolveUcStatus(audience, generalSetting))
                .build()
        );
    }

    private static String resolveUcStatus(
        PluginTemplateAudience audience,
        PluginTemplateGeneralSetting generalSetting
    ) {
        if (!generalSetting.isUcDashboardEnabled()) {
            return "optional";
        }
        return audience == PluginTemplateAudience.UC ? "now" : "recommended";
    }

    private static String uiDensityLabel(String density) {
        return switch (density) {
            case "compact" -> "紧凑";
            case "relaxed" -> "宽松";
            default -> "平衡";
        };
    }
}

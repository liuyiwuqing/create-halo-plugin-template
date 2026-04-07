package run.halo.plugintemplate.service.impl;

import java.time.Clock;
import java.time.OffsetDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import run.halo.app.plugin.ReactiveSettingFetcher;
import run.halo.plugintemplate.dto.PluginTemplateOverview;
import run.halo.plugintemplate.model.PluginTemplateAudience;
import run.halo.plugintemplate.service.PluginTemplateOverviewService;
import run.halo.plugintemplate.setting.PluginTemplateGeneralSetting;
import run.halo.plugintemplate.setting.PluginTemplateSettingKeys;
import run.halo.plugintemplate.setting.PluginTemplateUiSetting;
import run.halo.plugintemplate.utils.PluginTemplateSeeds;

@Service
@RequiredArgsConstructor
public class PluginTemplateOverviewServiceImpl implements PluginTemplateOverviewService {

    private final Clock pluginTemplateClock;
    private final ReactiveSettingFetcher settingFetcher;

    @Override
    public Mono<PluginTemplateOverview> getOverview(PluginTemplateAudience audience) {
        return Mono.zip(fetchGeneralSetting(), fetchUiSetting())
            .map(tuple -> PluginTemplateSeeds.buildOverview(
                audience,
                tuple.getT1(),
                tuple.getT2(),
                OffsetDateTime.now(pluginTemplateClock).toString()
            ));
    }

    private Mono<PluginTemplateGeneralSetting> fetchGeneralSetting() {
        return settingFetcher.fetch(PluginTemplateSettingKeys.GENERAL_GROUP, PluginTemplateGeneralSetting.class)
            .map(this::normalizeGeneralSetting)
            .switchIfEmpty(Mono.fromSupplier(PluginTemplateGeneralSetting::new))
            .onErrorReturn(new PluginTemplateGeneralSetting());
    }

    private Mono<PluginTemplateUiSetting> fetchUiSetting() {
        return settingFetcher.fetch(PluginTemplateSettingKeys.UI_GROUP, PluginTemplateUiSetting.class)
            .map(this::normalizeUiSetting)
            .switchIfEmpty(Mono.fromSupplier(PluginTemplateUiSetting::new))
            .onErrorReturn(new PluginTemplateUiSetting());
    }

    private PluginTemplateGeneralSetting normalizeGeneralSetting(PluginTemplateGeneralSetting setting) {
        if (setting.getEnableConsoleDashboard() == null) {
            setting.setEnableConsoleDashboard(PluginTemplateSettingKeys.DEFAULT_ENABLE_CONSOLE_DASHBOARD);
        }
        if (setting.getEnableUcDashboard() == null) {
            setting.setEnableUcDashboard(PluginTemplateSettingKeys.DEFAULT_ENABLE_UC_DASHBOARD);
        }
        if (setting.getEnableAttachmentProvider() == null) {
            setting.setEnableAttachmentProvider(PluginTemplateSettingKeys.DEFAULT_ENABLE_ATTACHMENT_PROVIDER);
        }
        return setting;
    }

    private PluginTemplateUiSetting normalizeUiSetting(PluginTemplateUiSetting setting) {
        if (setting.getAccentColor() == null || setting.getAccentColor().isBlank()) {
            setting.setAccentColor(PluginTemplateSettingKeys.DEFAULT_ACCENT_COLOR);
        }
        if (setting.getDensity() == null || setting.getDensity().isBlank()) {
            setting.setDensity(PluginTemplateSettingKeys.DEFAULT_DENSITY);
        }
        if (setting.getSupportLink() == null || setting.getSupportLink().isBlank()) {
            setting.setSupportLink(PluginTemplateSettingKeys.DEFAULT_SUPPORT_LINK);
        }
        return setting;
    }
}

package run.halo.plugintemplate.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Mono;
import run.halo.app.plugin.ReactiveSettingFetcher;
import run.halo.plugintemplate.model.PluginTemplateAudience;
import run.halo.plugintemplate.setting.PluginTemplateGeneralSetting;
import run.halo.plugintemplate.setting.PluginTemplateSettingKeys;
import run.halo.plugintemplate.setting.PluginTemplateUiSetting;

@ExtendWith(MockitoExtension.class)
class PluginTemplateOverviewServiceImplTest {

    private static final Clock FIXED_CLOCK = Clock.fixed(
        Instant.parse("2026-04-07T10:00:00Z"),
        ZoneOffset.UTC
    );

    @Mock
    ReactiveSettingFetcher settingFetcher;

    @Test
    void shouldApplyFetchedSettingsIntoOverview() {
        var generalSetting = new PluginTemplateGeneralSetting();
        generalSetting.setEnableConsoleDashboard(true);
        generalSetting.setEnableUcDashboard(false);
        generalSetting.setEnableAttachmentProvider(false);

        var uiSetting = new PluginTemplateUiSetting();
        uiSetting.setAccentColor("#102030");
        uiSetting.setDensity("compact");
        uiSetting.setSupportLink("https://example.com/help");

        when(settingFetcher.fetch(PluginTemplateSettingKeys.GENERAL_GROUP, PluginTemplateGeneralSetting.class))
            .thenReturn(Mono.just(generalSetting));
        when(settingFetcher.fetch(PluginTemplateSettingKeys.UI_GROUP, PluginTemplateUiSetting.class))
            .thenReturn(Mono.just(uiSetting));

        var service = new PluginTemplateOverviewServiceImpl(FIXED_CLOCK, settingFetcher);

        var overview = service.getOverview(PluginTemplateAudience.CONSOLE).block();

        assertThat(overview).isNotNull();
        assertThat(overview.getEnableConsoleDashboard()).isTrue();
        assertThat(overview.getEnableUcDashboard()).isFalse();
        assertThat(overview.getEnableAttachmentProvider()).isFalse();
        assertThat(overview.getAccentColor()).isEqualTo("#102030");
        assertThat(overview.getDensity()).isEqualTo("compact");
        assertThat(overview.getSupportLink()).isEqualTo("https://example.com/help");
        assertThat(overview.getStats())
            .extracting("key", "value")
            .containsExactly(
                org.assertj.core.groups.Tuple.tuple("routes", "1"),
                org.assertj.core.groups.Tuple.tuple("extension-points", "2"),
                org.assertj.core.groups.Tuple.tuple("ui-density", "紧凑")
            );
        assertThat(overview.getFeatures())
            .filteredOn(feature -> "uc-route".equals(feature.getKey()))
            .singleElement()
            .extracting(feature -> feature.getEnabled())
            .isEqualTo(false);
        assertThat(overview.getFeatures())
            .filteredOn(feature -> "attachment-tab".equals(feature.getKey()))
            .singleElement()
            .extracting(feature -> feature.getEnabled())
            .isEqualTo(false);
    }

    @Test
    void shouldFallbackToDefaultSettingsWhenFetcherReturnsEmpty() {
        when(settingFetcher.fetch(PluginTemplateSettingKeys.GENERAL_GROUP, PluginTemplateGeneralSetting.class))
            .thenReturn(Mono.empty());
        when(settingFetcher.fetch(PluginTemplateSettingKeys.UI_GROUP, PluginTemplateUiSetting.class))
            .thenReturn(Mono.empty());

        var service = new PluginTemplateOverviewServiceImpl(FIXED_CLOCK, settingFetcher);

        var overview = service.getOverview(PluginTemplateAudience.UC).block();

        assertThat(overview).isNotNull();
        assertThat(overview.getEnableConsoleDashboard()).isTrue();
        assertThat(overview.getEnableUcDashboard()).isTrue();
        assertThat(overview.getEnableAttachmentProvider()).isTrue();
        assertThat(overview.getAccentColor()).isEqualTo(PluginTemplateSettingKeys.DEFAULT_ACCENT_COLOR);
        assertThat(overview.getDensity()).isEqualTo(PluginTemplateSettingKeys.DEFAULT_DENSITY);
        assertThat(overview.getSupportLink()).isEqualTo(PluginTemplateSettingKeys.DEFAULT_SUPPORT_LINK);
    }
}

package run.halo.plugintemplate.service;

import reactor.core.publisher.Mono;
import run.halo.plugintemplate.dto.PluginTemplateOverview;
import run.halo.plugintemplate.model.PluginTemplateAudience;

public interface PluginTemplateOverviewService {

    Mono<PluginTemplateOverview> getOverview(PluginTemplateAudience audience);
}

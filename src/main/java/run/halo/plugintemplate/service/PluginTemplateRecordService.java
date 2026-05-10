package run.halo.plugintemplate.service;

import reactor.core.publisher.Mono;
import run.halo.app.extension.ListResult;
import run.halo.plugintemplate.query.PluginTemplateRecordQuery;
import run.halo.plugintemplate.scheme.PluginTemplateRecord;

public interface PluginTemplateRecordService {

    Mono<ListResult<PluginTemplateRecord>> list(PluginTemplateRecordQuery query);

    Mono<PluginTemplateRecord> create(PluginTemplateRecord record);

    Mono<PluginTemplateRecord> update(String id, PluginTemplateRecord record);

    Mono<PluginTemplateRecord> delete(String id);
}

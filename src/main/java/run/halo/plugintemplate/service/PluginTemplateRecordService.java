package run.halo.plugintemplate.service;

import reactor.core.publisher.Mono;
import run.halo.app.extension.ListResult;
import run.halo.plugintemplate.dto.PluginTemplateRecordCreateRequest;
import run.halo.plugintemplate.dto.PluginTemplateRecordUpdateRequest;
import run.halo.plugintemplate.query.PluginTemplateRecordQuery;
import run.halo.plugintemplate.scheme.PluginTemplateRecord;

public interface PluginTemplateRecordService {

    Mono<ListResult<PluginTemplateRecord>> list(PluginTemplateRecordQuery query);

    Mono<PluginTemplateRecord> create(PluginTemplateRecordCreateRequest request);

    Mono<PluginTemplateRecord> getByRecordId(String recordId);

    Mono<PluginTemplateRecord> update(String recordId, PluginTemplateRecordUpdateRequest request);

    Mono<Boolean> delete(String recordId);
}

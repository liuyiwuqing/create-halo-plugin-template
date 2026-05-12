package run.halo.plugintemplate.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import run.halo.app.extension.ListResult;
import run.halo.app.extension.Metadata;
import run.halo.app.extension.ReactiveExtensionClient;
import run.halo.app.extension.Unstructured;
import run.halo.plugintemplate.dto.PluginTemplateRecordCreateRequest;
import run.halo.plugintemplate.dto.PluginTemplateRecordUpdateRequest;
import run.halo.plugintemplate.query.PluginTemplateRecordQuery;
import run.halo.plugintemplate.scheme.PluginTemplateRecord;
import run.halo.plugintemplate.service.PluginTemplateRecordService;

@Service
@RequiredArgsConstructor
public class PluginTemplateRecordServiceImpl implements PluginTemplateRecordService {

    private static final String DEFAULT_STATUS = "draft";

    private final ReactiveExtensionClient reactiveExtensionClient;
    private final Clock pluginTemplateClock;
    private final ObjectMapper objectMapper = Unstructured.OBJECT_MAPPER;

    @Override
    public Mono<ListResult<PluginTemplateRecord>> list(PluginTemplateRecordQuery query) {
        return reactiveExtensionClient.listBy(PluginTemplateRecord.class, query.toListOptions(), query.toPageRequest());
    }

    @Override
    public Mono<PluginTemplateRecord> create(PluginTemplateRecordCreateRequest request) {
        var record = new PluginTemplateRecord();
        var recordId = normalizeRecordId(request.getId());
        var now = now();

        record.setId(recordId);
        record.setTitle(requiredTitle(request.getTitle()));
        record.setDescription(normalizeOptional(request.getDescription()));
        record.setStatus(resolveStatus(request.getStatus()));
        record.setCreateTime(now);
        record.setUpdateTime(now);

        var metadata = new Metadata();
        metadata.setGenerateName(PluginTemplateRecord.EXTENSION_NAME_PREFIX);
        metadata.setName(PluginTemplateRecord.EXTENSION_NAME_PREFIX + recordId);
        record.setMetadata(metadata);

        return create(record);
    }

    @Override
    public Mono<PluginTemplateRecord> getByRecordId(String recordId) {
        return reactiveExtensionClient.fetch(PluginTemplateRecord.class, extensionName(recordId));
    }

    @Override
    public Mono<PluginTemplateRecord> update(String recordId, PluginTemplateRecordUpdateRequest request) {
        return getByRecordId(recordId)
            .map(existing -> {
                existing.setTitle(requiredTitle(request.getTitle()));
                existing.setDescription(normalizeOptional(request.getDescription()));
                existing.setStatus(resolveStatus(request.getStatus()));
                existing.setUpdateTime(now());
                return existing;
            })
            .flatMap(this::update);
    }

    @Override
    public Mono<Boolean> delete(String recordId) {
        return getByRecordId(recordId)
            .flatMap(record -> reactiveExtensionClient.delete(record).thenReturn(Boolean.TRUE))
            .defaultIfEmpty(Boolean.FALSE);
    }

    private Mono<PluginTemplateRecord> create(PluginTemplateRecord source) {
        Map<?, ?> map = objectMapper.convertValue(source, Map.class);
        return reactiveExtensionClient.create(new Unstructured(map))
            .map(unstructured -> objectMapper.convertValue(unstructured, PluginTemplateRecord.class));
    }

    private Mono<PluginTemplateRecord> update(PluginTemplateRecord source) {
        Map<?, ?> map = objectMapper.convertValue(source, Map.class);
        return reactiveExtensionClient.update(new Unstructured(map))
            .map(unstructured -> objectMapper.convertValue(unstructured, PluginTemplateRecord.class));
    }

    private String requiredTitle(String title) {
        var normalized = normalizeOptional(title);
        if (normalized == null) {
            throw new IllegalArgumentException("标题不能为空");
        }
        return normalized;
    }

    private String normalizeRecordId(String id) {
        var normalized = normalizeOptional(id);
        if (normalized != null) {
            return normalized;
        }
        return UUID.randomUUID().toString().replace("-", "");
    }

    private String normalizeOptional(String value) {
        return StringUtils.defaultIfBlank(StringUtils.trim(value), null);
    }

    private String resolveStatus(String status) {
        var normalized = normalizeOptional(status);
        return normalized == null ? DEFAULT_STATUS : normalized;
    }

    private String extensionName(String recordId) {
        return PluginTemplateRecord.EXTENSION_NAME_PREFIX + normalizeRequiredRecordId(recordId);
    }

    private String normalizeRequiredRecordId(String recordId) {
        var normalized = normalizeOptional(recordId);
        if (normalized == null) {
            throw new IllegalArgumentException("recordId 不能为空");
        }
        return normalized;
    }

    private String now() {
        return OffsetDateTime.now(pluginTemplateClock).toString();
    }
}

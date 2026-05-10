package run.halo.plugintemplate.service.impl;

import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.Locale;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import run.halo.app.extension.ListResult;
import run.halo.app.extension.Metadata;
import run.halo.app.extension.ReactiveExtensionClient;
import run.halo.plugintemplate.query.PluginTemplateRecordQuery;
import run.halo.plugintemplate.scheme.PluginTemplateRecord;
import run.halo.plugintemplate.service.PluginTemplateRecordService;

@Service
@RequiredArgsConstructor
public class PluginTemplateRecordServiceImpl implements PluginTemplateRecordService {

    public static final String STATUS_DRAFT = "DRAFT";
    public static final String STATUS_PUBLISHED = "PUBLISHED";
    public static final String STATUS_ARCHIVED = "ARCHIVED";

    private final ReactiveExtensionClient reactiveExtensionClient;
    private final Clock pluginTemplateClock;

    @Override
    public Mono<ListResult<PluginTemplateRecord>> list(PluginTemplateRecordQuery query) {
        return reactiveExtensionClient.listBy(
            PluginTemplateRecord.class,
            query.toListOptions(),
            query.toPageRequest()
        );
    }

    @Override
    public Mono<PluginTemplateRecord> create(PluginTemplateRecord record) {
        var now = now();
        var normalized = normalizeForCreate(record, now);
        return reactiveExtensionClient.create(normalized);
    }

    @Override
    public Mono<PluginTemplateRecord> update(String id, PluginTemplateRecord record) {
        return getById(id)
            .map(existing -> normalizeForUpdate(existing, record, now()))
            .flatMap(reactiveExtensionClient::update);
    }

    @Override
    public Mono<PluginTemplateRecord> delete(String id) {
        return getById(id).flatMap(reactiveExtensionClient::delete);
    }

    private Mono<PluginTemplateRecord> getById(String id) {
        return reactiveExtensionClient.fetch(PluginTemplateRecord.class, toExtensionName(id))
            .switchIfEmpty(Mono.error(new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Plugin template record not found: " + id
            )));
    }

    private PluginTemplateRecord normalizeForCreate(PluginTemplateRecord record, String now) {
        var id = generateId();
        record.setId(id);
        record.setMetadata(buildMetadata(id));
        record.setTitle(requiredText(record.getTitle(), "title"));
        record.setDescription(normalizeText(record.getDescription()));
        record.setStatus(normalizeStatus(record.getStatus()));
        record.setEnabled(record.getEnabled() == null || record.getEnabled());
        record.setPriority(record.getPriority() == null ? 0 : record.getPriority());
        record.setPublishTime(normalizeText(record.getPublishTime()));
        record.setCreateTime(now);
        record.setUpdateTime(now);
        return record;
    }

    private PluginTemplateRecord normalizeForUpdate(
        PluginTemplateRecord existing,
        PluginTemplateRecord incoming,
        String now
    ) {
        existing.setTitle(requiredText(incoming.getTitle(), "title"));
        existing.setDescription(normalizeText(incoming.getDescription()));
        existing.setStatus(normalizeStatus(incoming.getStatus()));
        existing.setEnabled(incoming.getEnabled() == null || incoming.getEnabled());
        existing.setPriority(incoming.getPriority() == null ? 0 : incoming.getPriority());
        existing.setPublishTime(normalizeText(incoming.getPublishTime()));
        existing.setUpdateTime(now);
        return existing;
    }

    private Metadata buildMetadata(String id) {
        var metadata = new Metadata();
        metadata.setName(toExtensionName(id));
        return metadata;
    }

    private String now() {
        return OffsetDateTime.now(pluginTemplateClock).toString();
    }

    private static String generateId() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }

    private static String toExtensionName(String id) {
        return PluginTemplateRecord.EXTENSION_NAME_PREFIX + requiredText(id, "id");
    }

    private static String normalizeText(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }

    private static String requiredText(String value, String field) {
        if (!StringUtils.hasText(value)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, field + " is required");
        }
        return value.trim();
    }

    private static String normalizeStatus(String status) {
        var normalized = StringUtils.hasText(status)
            ? status.trim().toUpperCase(Locale.ROOT)
            : STATUS_DRAFT;
        if (STATUS_DRAFT.equals(normalized)
            || STATUS_PUBLISHED.equals(normalized)
            || STATUS_ARCHIVED.equals(normalized)) {
            return normalized;
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported status: " + status);
    }
}

package run.halo.plugintemplate.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Mono;
import run.halo.app.extension.ReactiveExtensionClient;
import run.halo.app.extension.Unstructured;
import run.halo.plugintemplate.dto.PluginTemplateRecordCreateRequest;
import run.halo.plugintemplate.dto.PluginTemplateRecordUpdateRequest;
import run.halo.plugintemplate.scheme.PluginTemplateRecord;

@ExtendWith(MockitoExtension.class)
class PluginTemplateRecordServiceImplTest {

    private static final Clock FIXED_CLOCK = Clock.fixed(
        Instant.parse("2026-05-10T10:00:00Z"),
        ZoneOffset.UTC
    );

    @Mock
    ReactiveExtensionClient reactiveExtensionClient;

    @Test
    void shouldCreateRecordWithDefaultValues() {
        when(reactiveExtensionClient.create(any(Unstructured.class)))
            .thenAnswer(invocation -> Mono.just(invocation.getArgument(0, Unstructured.class)));

        var service = new PluginTemplateRecordServiceImpl(reactiveExtensionClient, FIXED_CLOCK);
        var request = new PluginTemplateRecordCreateRequest();
        request.setTitle("  示例标题  ");
        request.setDescription("  示例描述  ");

        var record = service.create(request).block();

        assertThat(record).isNotNull();
        assertThat(record.getId()).isNotBlank();
        assertThat(record.getTitle()).isEqualTo("示例标题");
        assertThat(record.getDescription()).isEqualTo("示例描述");
        assertThat(record.getStatus()).isEqualTo("draft");
        assertThat(record.getCreateTime()).isEqualTo("2026-05-10T10:00Z");
        assertThat(record.getUpdateTime()).isEqualTo("2026-05-10T10:00Z");
        assertThat(record.getMetadata()).isNotNull();
        assertThat(record.getMetadata().getName())
            .isEqualTo(PluginTemplateRecord.EXTENSION_NAME_PREFIX + record.getId());
    }

    @Test
    void shouldUpdateRecordAndRefreshUpdateTime() {
        var existing = new PluginTemplateRecord();
        existing.setId("record-1");
        existing.setTitle("旧标题");
        existing.setDescription("旧描述");
        existing.setStatus("active");
        existing.setCreateTime("2026-05-01T10:00:00Z");
        existing.setUpdateTime("2026-05-01T10:00:00Z");
        var metadata = new run.halo.app.extension.Metadata();
        metadata.setName(PluginTemplateRecord.EXTENSION_NAME_PREFIX + "record-1");
        existing.setMetadata(metadata);

        when(reactiveExtensionClient.fetch(eq(PluginTemplateRecord.class), eq("plugin-template-record-record-1")))
            .thenReturn(Mono.just(existing));
        when(reactiveExtensionClient.update(any(Unstructured.class)))
            .thenAnswer(invocation -> Mono.just(invocation.getArgument(0, Unstructured.class)));

        var service = new PluginTemplateRecordServiceImpl(reactiveExtensionClient, FIXED_CLOCK);
        var request = new PluginTemplateRecordUpdateRequest();
        request.setTitle("  新标题  ");
        request.setDescription("   ");
        request.setStatus(" archived ");

        var updated = service.update("record-1", request).block();

        assertThat(updated).isNotNull();
        assertThat(updated.getId()).isEqualTo("record-1");
        assertThat(updated.getTitle()).isEqualTo("新标题");
        assertThat(updated.getDescription()).isNull();
        assertThat(updated.getStatus()).isEqualTo("archived");
        assertThat(updated.getUpdateTime()).isEqualTo("2026-05-10T10:00Z");
        assertThat(updated.getCreateTime()).isEqualTo("2026-05-01T10:00:00Z");
    }

    @Test
    void shouldDeleteExistingRecord() {
        var existing = new PluginTemplateRecord();
        existing.setId("record-1");
        var metadata = new run.halo.app.extension.Metadata();
        metadata.setName(PluginTemplateRecord.EXTENSION_NAME_PREFIX + "record-1");
        existing.setMetadata(metadata);

        when(reactiveExtensionClient.fetch(eq(PluginTemplateRecord.class), eq("plugin-template-record-record-1")))
            .thenReturn(Mono.just(existing));
        when(reactiveExtensionClient.delete(existing)).thenReturn(Mono.empty());

        var service = new PluginTemplateRecordServiceImpl(reactiveExtensionClient, FIXED_CLOCK);
        var deleted = service.delete("record-1").block();

        assertThat(deleted).isTrue();
        verify(reactiveExtensionClient).delete(existing);
    }

    @Test
    void shouldNotDeleteWhenRecordNotFound() {
        when(reactiveExtensionClient.fetch(eq(PluginTemplateRecord.class), eq("plugin-template-record-record-404")))
            .thenReturn(Mono.empty());

        var service = new PluginTemplateRecordServiceImpl(reactiveExtensionClient, FIXED_CLOCK);
        var deleted = service.delete("record-404").block();

        assertThat(deleted).isFalse();
        verify(reactiveExtensionClient, never()).delete(any(PluginTemplateRecord.class));
    }
}

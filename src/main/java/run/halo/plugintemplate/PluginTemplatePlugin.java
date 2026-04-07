package run.halo.plugintemplate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import run.halo.app.extension.Scheme;
import run.halo.app.extension.SchemeManager;
import run.halo.app.extension.index.IndexSpecs;
import run.halo.app.plugin.BasePlugin;
import run.halo.app.plugin.PluginContext;
import run.halo.plugintemplate.scheme.PluginTemplateRecord;

@Component
public class PluginTemplatePlugin extends BasePlugin {

    private static final Logger log = LoggerFactory.getLogger(PluginTemplatePlugin.class);

    private final SchemeManager schemeManager;

    public PluginTemplatePlugin(PluginContext pluginContext, SchemeManager schemeManager) {
        super(pluginContext);
        this.schemeManager = schemeManager;
    }

    @Override
    public void start() {
        schemeManager.register(PluginTemplateRecord.class, indexSpecs -> {
            indexSpecs.add(IndexSpecs.<PluginTemplateRecord, String>single("id", String.class).unique(true)
                .indexFunc(PluginTemplateRecord::getId));
            indexSpecs.add(IndexSpecs.<PluginTemplateRecord, String>single("title", String.class)
                .indexFunc(PluginTemplateRecord::getTitle));
            indexSpecs.add(IndexSpecs.<PluginTemplateRecord, String>single("status", String.class)
                .indexFunc(PluginTemplateRecord::getStatus));
        });
        log.info("Halo plugin template started.");
    }

    @Override
    public void stop() {
        schemeManager.unregister(Scheme.buildFromType(PluginTemplateRecord.class));
        log.info("Halo plugin template stopped.");
    }
}

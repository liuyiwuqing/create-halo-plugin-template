package run.halo.plugintemplate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import run.halo.app.extension.SchemeManager;
import run.halo.app.plugin.PluginContext;
import run.halo.plugintemplate.scheme.PluginTemplateRecord;

@ExtendWith(MockitoExtension.class)
class PluginTemplatePluginTest {

    @Mock
    PluginContext context;

    @Mock
    SchemeManager schemeManager;

    @Test
    void shouldRegisterAndUnregisterTemplateScheme() {
        PluginTemplatePlugin plugin = new PluginTemplatePlugin(context, schemeManager);

        plugin.start();
        plugin.stop();

        verify(schemeManager).register(eq(PluginTemplateRecord.class), any());
        verify(schemeManager).unregister(any());
    }
}

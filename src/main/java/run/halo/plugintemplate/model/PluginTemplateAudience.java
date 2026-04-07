package run.halo.plugintemplate.model;

public enum PluginTemplateAudience {
    CONSOLE("console", "Console"),
    UC("uc", "User Center"),
    PUBLIC("public", "Public");

    private final String code;
    private final String label;

    PluginTemplateAudience(String code, String label) {
        this.code = code;
        this.label = label;
    }

    public String getCode() {
        return code;
    }

    public String getLabel() {
        return label;
    }
}

package ua.softserve.rv036.findmeplace.model.enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum BanStatus {

    BAN("Banned"),
    NOT_BAN("Not Banned");

    private String name;

    BanStatus(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public String getValue() {
        return this.toString();
    }

}

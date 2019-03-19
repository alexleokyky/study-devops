package ua.softserve.rv036.findmeplace.model.enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum Role {

    ROLE_USER("User"),
    ROLE_ADMIN("Admin"),
    ROLE_MANAGER("Manager"),
    ROLE_OWNER("Owner");

    private String name;

    Role(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public String getValue() {
        return this.toString();
    }

}

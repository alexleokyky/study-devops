package ua.softserve.rv036.findmeplace.model.enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum BookingStatus {
    OPEN, APPROVE, CLOSE
}

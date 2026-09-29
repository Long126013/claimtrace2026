package com.claimtrace.iam.user.dto;

import jakarta.validation.constraints.NotNull;

public class UpdateStatusRequest {

    @NotNull(message = "Enabled status must not be null")
    private Boolean enabled;

    public UpdateStatusRequest() {
    }

    public UpdateStatusRequest(Boolean enabled) {
        this.enabled = enabled;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }
}

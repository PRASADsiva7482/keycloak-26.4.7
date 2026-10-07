<#import "template.ftl" as layout>
<#import "password-commons.ftl" as passwordCommons>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('password','password-confirm'); section>
    <#if section = "header">
        ${msg("updatePasswordTitle")}
    <#elseif section = "form">
        <form id="kc-passwd-update-form" class="${properties.kcFormClass!}" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
            <div class="form-group" style="margin-bottom: 10px;">
                <label for="password-new" class="pf-c-form__label pf-c-form__label-text">${msg("passwordNew")} *</label>
                <div class="vf-input-box" dir="ltr">
                    <input type="password" id="password-new" name="password-new" class="pf-c-form-control vf-capsule-input"
                           autofocus autocomplete="new-password"
                           placeholder="••••••••••••"
                           aria-invalid="<#if messagesPerField.existsError('password','password-confirm')>true</#if>"
                    />
                </div>

                <#if messagesPerField.existsError('password')>
                    <span id="input-error-password" class="vf-input-error" aria-live="polite">
                        ${kcSanitize(messagesPerField.get('password'))?no_esc}
                    </span>
                </#if>
            </div>

            <div class="form-group" style="margin-bottom: 10px;">
                <label for="password-confirm" class="pf-c-form__label pf-c-form__label-text">${msg("passwordConfirm")} *</label>
                <div class="vf-input-box" dir="ltr">
                    <input type="password" id="password-confirm" name="password-confirm"
                           class="pf-c-form-control vf-capsule-input"
                           autocomplete="new-password"
                           placeholder="••••••••••••"
                           aria-invalid="<#if messagesPerField.existsError('password-confirm')>true</#if>"
                    />
                </div>

                <#if messagesPerField.existsError('password-confirm')>
                    <span id="input-error-password-confirm" class="vf-input-error" aria-live="polite">
                        ${kcSanitize(messagesPerField.get('password-confirm'))?no_esc}
                    </span>
                </#if>
            </div>

            <div class="${properties.kcFormGroupClass!}">
                <div id="kc-form-options" class="${properties.kcFormOptionsClass!}">
                    <div class="${properties.kcFormOptionsWrapperClass!}">
                        <div class="checkbox">
                            <label>
                                <input tabindex="5" id="logout-sessions" name="logout-sessions" value="on" type="checkbox" checked>
                                <span>${msg("logoutOtherSessions")}</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                    <#if isAppInitiatedAction??>
                        <input name="login" class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} vf-capsule-btn" type="submit" value="${msg("doSubmit")}" />
                        <button class="${properties.kcButtonClass!} ${properties.kcButtonDefaultClass!} vf-capsule-btn vf-btn-ghost" type="submit" name="cancel-aia" value="true">${msg("doCancel")}</button>
                    <#else>
                        <input name="login" class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} vf-capsule-btn" type="submit" value="${msg("doSubmit")}" />
                    </#if>
                </div>
            </div>
        </form>
    </#if>
</@layout.registrationLayout>

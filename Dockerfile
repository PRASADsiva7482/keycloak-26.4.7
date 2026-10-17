# =============================================================================
# VoltForge Keycloak — Custom Themed Image
# =============================================================================
FROM quay.io/keycloak/keycloak:26.1

# Bake custom themes directly into image
COPY themes/v-app /opt/keycloak/themes/v-app
COPY themes/volt /opt/keycloak/themes/volt

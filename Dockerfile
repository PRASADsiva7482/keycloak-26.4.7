# =============================================================================
# VoltForge Keycloak — Custom Themed Image
# =============================================================================
FROM quay.io/keycloak/keycloak:26.1

# Bake custom v-app theme directly into image
COPY themes/v-app /opt/keycloak/themes/v-app

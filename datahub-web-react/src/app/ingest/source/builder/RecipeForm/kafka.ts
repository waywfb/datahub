import { RecipeField, FieldType, setListValuesOnRecipe } from './common';

// TODO: Currently platform_instance is required to be present for stateful ingestion to work
// We need to solve this prior to enabling by default here.

const saslUsernameFieldPath = ['source', 'config', 'connection', 'consumer_config', 'sasl.username'];
export const KAFKA_SASL_USERNAME: RecipeField = {
    name: 'connection.consumer_config.sasl.username',
    label: 'ingest.recipeForms.label.username',
    placeholder: 'datahub-client',
    tooltip: 'ingest.kafka.kafkaUsernameToolTip',
    type: FieldType.TEXT,
    fieldPath: saslUsernameFieldPath,
    rules: null,
};

const saslPasswordFieldPath = ['source', 'config', 'connection', 'consumer_config', 'sasl.password'];
export const KAFKA_SASL_PASSWORD: RecipeField = {
    name: 'connection.consumer_config.sasl.password',
    label: 'ingest.recipeForms.label.password',
    placeholder: 'datahub-client-password',
    tooltip: 'ingest.kafka.kafkaPasswordToolTip',
    type: FieldType.SECRET,
    fieldPath: saslPasswordFieldPath,
    rules: null,
};

export const KAFKA_BOOTSTRAP: RecipeField = {
    name: 'connection.bootstrap',
    label: 'ingest.kafka.label.bootstrapServers',
    required: true,
    tooltip: 'ingest.kafka.kafkaBootstrapToolTip',
    placeholder: 'abc-defg.eu-west-1.aws.confluent.cloud:9092',
    type: FieldType.TEXT,
    fieldPath: 'source.config.connection.bootstrap',
    rules: null,
};

export const KAFKA_SCHEMA_REGISTRY_URL: RecipeField = {
    name: 'connection.schema_registry_url',
    label: 'ingest.kafka.label.schemaRegistryURL',
    tooltip: 'ingest.kafka.schemaRegistryURLToolTip',
    placeholder: 'https://abc-defgh.us-east-2.aws.confluent.cloud',
    type: FieldType.TEXT,
    fieldPath: 'source.config.connection.schema_registry_url',
    rules: null,
};

const registryCredentialsFieldPath = [
    'source',
    'config',
    'connection',
    'schema_registry_config',
    'basic.auth.user.info',
];
export const KAFKA_SCHEMA_REGISTRY_USER_CREDENTIAL: RecipeField = {
    name: 'schema_registry_config.basic.auth.user.info',
    label: 'ingest.kafka.label.schemaRegistryCredentials',
    tooltip: 'ingest.kafka.schemaRegistryCredentialsToolTip',
    // eslint-disable-next-line no-template-curly-in-string
    placeholder: '${REGISTRY_API_KEY_ID}:${REGISTRY_API_KEY_SECRET}',
    type: FieldType.TEXT,
    fieldPath: registryCredentialsFieldPath,
    rules: null,
};

const securityProtocolFieldPath = ['source', 'config', 'connection', 'consumer_config', 'security.protocol'];
export const KAFKA_SECURITY_PROTOCOL: RecipeField = {
    name: 'security.protocol',
    label: 'ingest.kafka.label.securityProtocol',
    tooltip: 'ingest.kafka.securityProtocolToolTip',
    type: FieldType.SELECT,
    required: true,
    fieldPath: securityProtocolFieldPath,
    rules: null,
    options: [
        { label: 'PLAINTEXT', value: 'PLAINTEXT' },
        { label: 'SASL_SSL', value: 'SASL_SSL' },
        { label: 'SASL_PLAINTEXT', value: 'SASL_PLAINTEXT' },
        { label: 'SSL', value: 'SSL' },
    ],
};

const saslMechanismFieldPath = ['source', 'config', 'connection', 'consumer_config', 'sasl.mechanism'];
export const KAFKA_SASL_MECHANISM: RecipeField = {
    name: 'sasl.mechanism',
    label: 'ingest.kafka.label.saslMechanism',
    tooltip: 'ingest.kafka.saslMechanismToolTip',
    type: FieldType.SELECT,
    fieldPath: saslMechanismFieldPath,
    placeholder: 'None',
    rules: null,
    options: [
        { label: 'PLAIN', value: 'PLAIN' },
        { label: 'SCRAM-SHA-256', value: 'SCRAM-SHA-256' },
        { label: 'SCRAM-SHA-512', value: 'SCRAM-SHA-512' },
    ],
};

const topicAllowFieldPath = 'source.config.topic_patterns.allow';
export const TOPIC_ALLOW: RecipeField = {
    name: 'topic_patterns.allow',
    label: 'ingest.recipeForms.label.allowPatterns',
    tooltip: 'ingest.kafka.kafkaTopicAllowToolTip',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: topicAllowFieldPath,
    rules: null,
    section: 'ingest.kafka.section.filterByTopic',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, topicAllowFieldPath),
};

const topicDenyFieldPath = 'source.config.topic_patterns.deny';
export const TOPIC_DENY: RecipeField = {
    name: 'topic_patterns.deny',
    label: 'ingest.recipeForms.label.denyPatterns',
    tooltip: 'ingest.kafka.kafkaTopicDenyToolTip',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: topicDenyFieldPath,
    rules: null,
    section: 'ingest.kafka.section.filterByTopic',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, topicDenyFieldPath),
};

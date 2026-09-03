/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

/**
 * A localizable text value.
 *
 * The value is either a scalar string or an object whose property names are
 * BCP 47 language tags and whose property values are the localized strings.
 */
export type LocalizableString = string | Record<string, string>;

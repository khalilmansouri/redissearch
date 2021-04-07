import { createClient, ClientOpts, RedisClient } from "redis"


class redissearch {
  redis: RedisClient
  constructor(clientOpts: ClientOpts) {
    this.redis = createClient(clientOpts);
  }

  async sendCommand(command: string, arg?: any[]) {
    return await new Promise((resolve, reject) => {
      this.redis.sendCommand(command, arg, (err, reply) => {
        if (err)
          reject(err)
        else
          resolve(reply)
      })
    })
  }

  /**
   * Disconnecting from the Redis database with the module
   */
  async disconnect(): Promise<void> {
    await this.redis.quit();
  }

  /**
   * Creating an index with a given spec
   * @param parameters The additional parameters of the spec
   * @param schemaFields The filter set after the 'SCHEMA' argument
   * @returns 'OK'
   */
  async create(index: string, schemaFields: FTSchemaField[], parameters?: FTCreateParameters): Promise<'OK'> {
    try {
      let args: string[] = [index]
      args = args.concat(['ON', 'HASH']);
      if (parameters !== undefined) {
        if (parameters.prefix !== undefined) {
          args.push('PREFIX');
          for (const prefix of parameters.prefix)
            args = args.concat([prefix.count.toString(), prefix.name])
        }
        if (parameters.filter !== undefined)
          args = args.concat(['FILTER', parameters.filter])
        if (parameters.language !== undefined)
          args = args.concat(['LANGUAGE', parameters.language]);
        if (parameters.languageField !== undefined)
          args = args.concat(['LANGUAGE_FIELD', parameters.languageField]);
        if (parameters.score !== undefined)
          args = args.concat(['SCORE', parameters.score])
        if (parameters.scoreField !== undefined)
          args = args.concat(['SCORE_FIELD', parameters.scoreField])
        if (parameters.payloadField !== undefined)
          args = args.concat(['PAYLOAD_FIELD', parameters.payloadField])
        if (parameters.maxTextFields !== undefined)
          args = args.concat(['MAXTEXTFIELDS', parameters.maxTextFields.toString()])
        if (parameters.noOffsets !== undefined)
          args.push('NOOFFSETS');
        if (parameters.temporary !== undefined)
          args.push('TEMPORARY');
        if (parameters.nohl !== undefined)
          args.push('NOHL');
        if (parameters.noFields !== undefined)
          args.push('NOFIELDS');
        if (parameters.noFreqs !== undefined)
          args.push('NOFREQS');
        if (parameters.stopwords !== undefined)
          args = args.concat(['STOPWORDS', parameters.stopwords.num.toString(), parameters.stopwords.stopword]);
        if (parameters.skipInitialScan !== undefined)
          args.push('SKIPINITIALSCAN');
      }
      args.push('SCHEMA');
      for (const field of schemaFields) {
        args = args.concat([field.name, field.type]);
        if (field.nostem !== undefined) args.push('NOSTEM');
        if (field.weight !== undefined) args = args.concat(['WEIGHT', field.weight.toString()]);
        if (field.phonetic !== undefined) args = args.concat(['PHONETIC', field.phonetic]);
        if (field.seperator !== undefined) args = args.concat(['SEPERATOR', field.seperator]);
        if (field.sortable !== undefined) args.push('SORTABLE');
        if (field.noindex !== undefined) args.push('NOINDEX');
      }
      await this.redis.send_command('FT.CREATE', args);
      return "OK"
    }
    catch (err) {
      throw err;
    }
  }

  /**
 * Deleting the index
 * @param index The index
 * @param deleteHash If set, the drop operation will delete the actual document hashes.
 * @returns 'OK'
 */
  async dropindex(index: string, deleteHash = false): Promise<'OK'> {
    try {
      const args = [index];
      if (deleteHash === true) args.push('DD')
      await this.redis.send_command('FT.DROPINDEX', args);
      return "OK";
    }
    catch (err) {
      return err;
    }
  }

  /**
 * Searching the index with a textual query
 * @param index The index
 * @param query The query
 * @param parameters The additional optional parameter
 * @returns Array reply, where the first element is the total number of results, and then pairs of document id, and a nested array of field/value.
 */

  async search(index: string, query: string, parameters?: FTSearchParameters): Promise<any> {
    try {
      let args: string[] = [index, query];
      if (parameters !== undefined) {
        if (parameters.noContent === true)
          args.push('NOCONTENT')
        if (parameters.verbatim === true)
          args.push('VERBARIM')
        if (parameters.nonStopWords === true)
          args.push('NOSTOPWORDS')
        if (parameters.withScores === true)
          args.push('WITHSCORES')
        if (parameters.withPayloads === true)
          args.push('WITHPAYLOADS')
        if (parameters.withSortKeys === true)
          args.push('WITHSORTKEYS')
        if (parameters.filter !== undefined)
          args = args.concat(['FILTER', parameters.filter.field, parameters.filter.min.toString(), parameters.filter.max.toString()])
        if (parameters.geoFilter !== undefined)
          args = args.concat([
            'GEOFILTER',
            parameters.geoFilter.field,
            parameters.geoFilter.lon.toString(),
            parameters.geoFilter.lat.toString(),
            parameters.geoFilter.radius.toString(),
            parameters.geoFilter.measurement
          ])
        if (parameters.inKeys !== undefined)
          args = args.concat(['INKEYS', parameters.inKeys.num.toString(), parameters.inKeys.field])
        if (parameters.inFields !== undefined)
          args = args.concat(['INFIELDS', parameters.inFields.num.toString(), parameters.inFields.field])
        if (parameters.return !== undefined)
          args = args.concat(['RETURN', parameters.return.num.toString(), parameters.return.field])
        if (parameters.summarize !== undefined) {
          args.push('SUMMARIZE')
          if (parameters.summarize.fields !== undefined) {
            args.push('FIELDS')
            for (const field of parameters.summarize.fields) {
              args = args.concat([field.num.toString(), field.field]);
            }
          }
          if (parameters.summarize.frags !== undefined)
            args = args.concat(['FRAGS', parameters.summarize.frags.toString()])
          if (parameters.summarize.len !== undefined)
            args = args.concat(['LEN', parameters.summarize.len.toString()])
          if (parameters.summarize.seperator !== undefined)
            args = args.concat(['SEPARATOR', parameters.summarize.seperator])
        }
        if (parameters.highlight !== undefined) {
          args.push('HIGHLIGHT')
          if (parameters.highlight.fields !== undefined) {
            args.push('FIELDS')
            for (const field of parameters.highlight.fields) {
              args = args.concat([field.num.toString(), field.field]);
            }
          }
          if (parameters.highlight.tags !== undefined) {
            args.push('TAGS')
            for (const tag of parameters.highlight.tags) {
              args = args.concat([tag.open, tag.close]);
            }
          }
        }
        if (parameters.slop !== undefined)
          args = args.concat(['SLOP', parameters.slop.toString()])
        if (parameters.inOrder !== undefined)
          args.push('INORDER')
        if (parameters.language !== undefined)
          args = args.concat(['LANGUAGE', parameters.language])
        if (parameters.expander !== undefined)
          args = args.concat(['EXPANDER', parameters.expander])
        if (parameters.scorer !== undefined)
          args = args.concat(['SCORER', parameters.scorer])
        if (parameters.explainScore !== undefined)
          args.push('EXPLAINSCORE')
        if (parameters.payload)
          args = args.concat(['PAYLOAD', parameters.payload])
        if (parameters.sortBy !== undefined)
          args = args.concat(['SORTBY', parameters.sortBy.field, parameters.sortBy.sort])
        if (parameters.limit !== undefined)
          args = args.concat(['LIMIT', parameters.limit.first.toString(), parameters.limit.num.toString()])
      }
      let reply = await this.sendCommand('FT.SEARCH', args);
      return reply

    }
    catch (err) {
      return err;
    }
  }

  /**
   * Insersting document in spefic insdex
   * @param index The index
   * @param id The document unique ID, 
   * @return 'OK'
   */

  async insert(index: string, id: string | number, doc: any): Promise<any> {
    let hash = index + "#" + id
    let args: any[] = [hash]
    Object.keys(doc).forEach(key => args = args.concat([key, doc[key]]))
    return await this.sendCommand("HSET", args)
  }

}

/**
 * The 'FT.CREATE' additional optional parameters
 * @param filter The expression of the 'FILTER' parameter. is a filter expression with the full RediSearch aggregation expression language.
 * @param payloadField The field of the 'PAYLOAD' parameter. If set indicates the document field that should be used as a binary safe payload string to the document, that can be evaluated at query time by a custom scoring function, or retrieved to the client.
 * @param maxTextFields The 'MAXTEXTFIELDS' parameter. For efficiency, RediSearch encodes indexes differently if they are created with less than 32 text fields.
 * @param noOffsets The 'NOFFSETS' parameter. If set, we do not store term offsets for documents (saves memory, does not allow exact searches or highlighting).
 * @param temporary The 'TEMPORARY' parameter. Create a lightweight temporary index which will expire after the specified period of inactivity.
 * @param nohl The 'NOHL' parameter. Conserves storage space and memory by disabling highlighting support. If set, we do not store corresponding byte offsets for term positions.
 * @param noFields The 'NOFIELDS' parameter. If set, we do not store field bits for each term.
 * @param noFreqs The 'NOFREQS' parameter.  If set, we avoid saving the term frequencies in the index.
 * @param skipInitialScan The 'SKIPINITIALSCAN' parameter. If set, we do not scan and index. 
 * @param prefix The 'PREFIX' parameter. tells the index which keys it should index.
 * @param prefix.count The count argument of the 'PREFIX' parameter. 
 * @param prefix.name The name argument of the 'PREFIX' parameter. 
 * @param language The 'LANGUAGE' parameter.  If set indicates the default language for documents in the index.
 * @param languageField The 'LANGUAGE_FIELD' parameter. If set indicates the document field that should be used as the document language.
 * @param score The 'SCORE' parameter. If set indicates the default score for documents in the index.
 * @param scoreField The 'SCORE_FIELD' parameter. If set indicates the document field that should be used as the document's rank based on the user's ranking. 
 * @param stopwords The 'STOPWORDS' parameter. If set, we set the index with a custom stopword list, to be ignored during indexing and search time.
 * @param stopwords.num The num argument of the 'STOPWORDS' parameter. 
 * @param stopwords.stopword The stopword argument of the 'STOPWORDS' parameter.
 */
export type FTCreateParameters = {
  filter?: string,
  payloadField?: string,
  maxTextFields?: number,
  noOffsets?: string,
  temporary?: number,
  nohl?: string,
  noFields?: string,
  noFreqs?: string,
  skipInitialScan?: boolean
  prefix?: {
    count: number,
    name: string
  }[],
  language?: string,
  languageField?: string,
  score?: string,
  scoreField?: string
  stopwords?: {
    num: number,
    stopword: string
  }
}

/**
* The field parameter
* @param sortable The 'SORTABLE' parameter. Numeric, tag or text field can have the optional SORTABLE argument that allows the user to later sort the results by the value of this field (this adds memory overhead so do not declare it on large text fields).
* @param nostem The 'NOSTEM' parameter. Text fields can have the NOSTEM argument which will disable stemming when indexing its values. This may be ideal for things like proper names.
* @param noindex The 'NOINDEX' parameter. Fields can have the NOINDEX option, which means they will not be indexed. This is useful in conjunction with SORTABLE , to create fields whose update using PARTIAL will not cause full reindexing of the document. If a field has NOINDEX and doesn't have SORTABLE, it will just be ignored by the index.
* @param phonetic The 'PHONETIC' parameter. Declaring a text field as PHONETIC will perform phonetic matching on it in searches by default. The obligatory {matcher} argument specifies the phonetic algorithm and language used.
* @param weight The 'WEIGHT' parameter. For TEXT fields, declares the importance of this field when calculating result accuracy. This is a multiplication factor, and defaults to 1 if not specified.
* @param seperator The 'SEPERATOR' parameter. For TAG fields, indicates how the text contained in the field is to be split into individual tags. The default is , . The value must be a single character.
*/
export type FTFieldOptions = {
  sortable?: boolean,
  noindex?: boolean,
  nostem?: boolean,
  phonetic?: string,
  weight?: number,
  seperator?: string
}

/**
* The parameters of the 'FT.CREATE' command, schema fields (Field comming after the 'SCHEMA' command)
* @param name The name of the field
* @param type The type of the field
* @param sortable The 'SORTABLE' parameter. Numeric, tag or text field can have the optional SORTABLE argument that allows the user to later sort the results by the value of this field (this adds memory overhead so do not declare it on large text fields).
* @param nostem The 'NOSTEM' parameter. Text fields can have the NOSTEM argument which will disable stemming when indexing its values. This may be ideal for things like proper names.
* @param noindex The 'NOINDEX' parameter. Fields can have the NOINDEX option, which means they will not be indexed. This is useful in conjunction with SORTABLE , to create fields whose update using PARTIAL will not cause full reindexing of the document. If a field has NOINDEX and doesn't have SORTABLE, it will just be ignored by the index.
* @param phonetic The 'PHONETIC' parameter. Declaring a text field as PHONETIC will perform phonetic matching on it in searches by default. The obligatory {matcher} argument specifies the phonetic algorithm and language used.
* @param weight The 'WEIGHT' parameter. For TEXT fields, declares the importance of this field when calculating result accuracy. This is a multiplication factor, and defaults to 1 if not specified.
* @param seperator The 'SEPERATOR' parameter. For TAG fields, indicates how the text contained in the field is to be split into individual tags. The default is , . The value must be a single character.
*/
export interface FTSchemaField extends FTFieldOptions {
  name: string,
  type: FTFieldType,
}

/**
* The parameter of the 'FT.SEARCH' command
* @param noContent The 'NOTCONTENT' parameter. If it appears after the query, we only return the document ids and not the content.
* @param verbatim The 'VERBATIM' parameter.  if set, we do not try to use stemming for query expansion but search the query terms verbatim.
* @param nonStopWords The 'NONSTOPWORDS' parameter. If set, we do not filter stopwords from the query. 
* @param withScores The 'WITHSCORES' parameter. If set, we also return the relative internal score of each document.
* @param withPayloads The 'WITHPAYLOADS' parameter. If set, we retrieve optional document payloads (see FT.ADD).
* @param withSoryKeys The 'WITHSORTKEYS' parameter. Only relevant in conjunction with SORTBY . Returns the value of the sorting key, right after the id and score and /or payload if requested.
* @param filter The 'FILTER' parameter.  If set, and numeric_field is defined as a numeric field in FT.CREATE, we will limit results to those having numeric values ranging between min and max. min and max follow ZRANGE syntax, and can be -inf , +inf and use ( for exclusive ranges. 
* @param filter.field The numeric_field argument of the 'FILTER' parameter
* @param filter.min The min argument of the 'FILTER' parameter
* @param filter.max The max argument of the 'FILTER' parameter
* @param geoFilter The 'GEOFILTER' parameter. If set, we filter the results to a given radius from lon and lat. Radius is given as a number and units.
* @param geoFilter.field The field of the 'GEOFILTER' parameter
* @param geoFilter.lon The lon argument of the 'GEOFILTER' parameter
* @param geoFilter.lat The lat argument of the 'GEOFILTER' parameter
* @param geoFilter.radius The radius argument of the 'GEOFILTER' parameter
* @param geoFilter.measurement The measurement argument of the 'GEOFILTER' parameter
* @param inKeys The 'INKEYS' parameter. If set, we limit the result to a given set of keys specified in the list. the first argument must be the length of the list, and greater than zero.
* @param inKeys.num The num argument of the 'INKEYS' parameter
* @param inKeys.field The field argument of the 'INKEYS' parameter
* @param inFields The 'INFIELDS' parameter. If set, filter the results to ones appearing only in specific fields of the document, like title or URL.
* @param inFields.num The num argument of the 'INFIELDS' parameter
* @param inFields.field The field argument of the 'INFIELDS' parameter
* @param return The 'RETURN' parameter. Use this keyword to limit which fields from the document are returned.
* @param return.num The num argument of the 'RETURN' parameter
* @param return.field The field of the 'RETURN' parameter
* @param summarize The 'SUMMARIZE' parameter. Use this option to return only the sections of the field which contain the matched text.
* @param summarize.fields The fields argument of the 'SUMMARIZE' parameter
* @param summarize.fields.num The num argument of the fields argument
* @param summarize.fields.field The field argument of the fields argument
* @param summarize.frags The fargs argument of the 'SUMMARIZE' parameter
* @param summarize.len The len argument of the 'SUMMARIZE' parameter
* @param summarize.seperator The seperator argument of the 'SUMMARIZE' parameter
* @param highlight The 'HIGHLIGHT' parameter. Use this option to format occurrences of matched text.
* @param highlight.fields The fields argument of the 'HIGHLIGHT' parameter
* @param highlight.fields.num The num argument of the fields argument
* @param highlight.fields.field The field argument of the fields argument
* @param highlight.tags The tags argument of the 'HIGHLIGHT' parameter
* @param highlight.open The open argument of the tags argument
* @param highlight.close The close argument of the tags argument
* @param slop The 'SLOP' parameter. If set, we allow a maximum of N intervening number of unmatched offsets between phrase terms.
* @param inorder The 'INORDER' parameter. If set, and usually used in conjunction with SLOP, we make sure the query terms appear in the same order in the document as in the query, regardless of the offsets between them. 
* @param language The 'LANGUAGE' parameter. If set, we use a stemmer for the supplied language during search for query expansion.
* @param expander The 'EXPANDER' parameter. If set, we will use a custom query expander instead of the stemmer.
* @param scorer The 'SCORER' parameter. If set, we will use a custom scoring function defined by the user.
* @param explainScore The 'EXPLAINSCORE' parameter. If set, will return a textual description of how the scores were calculated.
* @param payload The 'PAYLOAD' parameter. Add an arbitrary, binary safe payload that will be exposed to custom scoring functions.
* @param sortBy The 'SORTBY' parameter. If specified, the results are ordered by the value of this field. This applies to both text and numeric fields.
* @param sortBy.field The <> argument of the 'SORTBY' parameter
* @param sortBy.sort The <> argument of the 'SORTBY' parameter
* @param limit The 'LIMIT' parameter. If the parameters appear after the query, we limit the results to the offset and number of results given.
* @param limit.first The <> argument of the 'LIMIT' parameter
* @param limit.num The <> argument of the 'LIMIT' parameter
*/
export type FTSearchParameters = {
  noContent?: boolean,
  verbatim?: boolean,
  nonStopWords?: boolean,
  withScores?: boolean,
  withPayloads?: boolean,
  withSortKeys?: boolean,
  filter?: {
    field: string,
    min: number,
    max: number
  },
  geoFilter?: {
    field: string,
    lon: number,
    lat: number,
    radius: number,
    measurement: 'm' | 'km' | 'mi' | 'ft'
  },
  inKeys?: {
    num: number,
    field: string
  },
  inFields?: {
    num: number,
    field: string
  },
  return?: {
    num: number,
    field: string
  },
  summarize?: {
    fields?: {
      num: number,
      field: string
    }[],
    frags?: number,
    len?: number,
    seperator?: string
  },
  highlight?: {
    fields?: {
      num: number,
      field: string
    }[],
    tags?: {
      open: string,
      close: string
    }[]
  },
  slop?: number,
  inOrder?: boolean,
  language?: string,
  expander?: string,
  scorer?: string,
  explainScore?: boolean,
  payload?: string,
  sortBy?: {
    field: string,
    sort: 'ASC' | 'DESC'
  },
  limit?: {
    first: number,
    num: number
  }
}

/**
* The additional parameter of 'FT.AGGREGATE' command
* @param load The 'LOAD' parameter. 
* @param load.nargs The number of arguments
* @param load.property The property name
* @param groupby The 'GROUPBY' parameter.
* @param groupby.nargs The number of arguments of the 'GROUPBY' parameter
* @param groupby.property The property name of the 'GROUPBY' parameter
* @param reduce The 'REDUCE' parameter.
* @param reduce.function A function of the 'REDUCE' parameter
* @param reduce.nargs The number of arguments of the 'REDUCE' parameter
* @param reduce.arg The argument of the 'REDUCE' parameter
* @param reduce.as The name of the function of the 'REDUCE' parameter
* @param sortby The 'SORTBY' parameter. 
* @param sortby.nargs The number of arguments of the 'SORTBY' parameter
* @param sortby.property The property name of the 'SORTBY' parameter
* @param sortby.sort The sort type of the 'SORTBY' parameter
* @param sortby.max The max of the 'SORTBY' parameter
* @param apply The 'APPLY' parameter. 
* @param apply.expression The expression of the 'APPLY' parameter
* @param apply.as The as of the 'APPLY' parameter
* @param limit The 'LIMIT' parameter.
* @param limit.offset The offset of the 'LIMIT' parameter
* @param limit.numberOfResults The number of results of the 'LIMIT' parameter
* @param filter The expression of the 'FILTER' parameter.
*/
export type FTAggregateParameters = {
  load?: {
    nargs: string,
    property: string
  },
  groupby?: {
    nargs: string,
    property: string
  },
  reduce?: {
    function: string,
    nargs: string,
    arg: string,
    as: string
  },
  sortby?: {
    nargs: string,
    property: string,
    sort: 'ASC' | 'DESC',
    max: number
  },
  apply?: {
    expression: string,
    as: string
  },
  limit?: {
    offset: string,
    numberOfResults: number
  },
  filter?: string
}

/**
* The additional parameters of 'FT.SUGADD' command
* @param incr The 'INCR' parameter. if set, we increment the existing entry of the suggestion by the given score, instead of replacing the score. This is useful for updating the dictionary based on user queries in real time
* @param payload The 'PAYLOAD' parameter. If set, we save an extra payload with the suggestion, that can be fetched by adding the WITHPAYLOADS argument to FT.SUGGET
*/
export type FTSugAddParameters = {
  incr: number,
  payload: string
}

/**
* The additional parameters of 'FT.SUGGET' command
* @param fuzzy The 'FUZZY' parameter. if set, we do a fuzzy prefix search, including prefixes at Levenshtein distance of 1 from the prefix sent
* @param max The 'MAX' parameter. If set, we limit the results to a maximum of num (default: 5).
* @param withScores The 'WITHSCORES' parameter. If set, we also return the score of each suggestion. this can be used to merge results from multiple instances
* @param withPayloads The 'WITHPAYLOADS' parameter. If set, we return optional payloads saved along with the suggestions. If no payload is present for an entry, we return a Null Reply.
*/
export type FTSugGetParameters = {
  fuzzy: string,
  max: number,
  withScores: boolean,
  withPayloads: boolean
}

/**
* The additional parameters of 'FT.SPELLCHECK' command
* @param terms A list of terms
* @param terms.type The type of the term
* @param terms.dict The dict of the term
* @param distance The maximal Levenshtein distance for spelling suggestions (default: 1, max: 4)
*/
export type FTSpellCheck = {
  terms?: {
    type: 'INCLUDE' | 'EXCLUDE',
    dict?: string
  }[],
  distance?: string
}

/**
* The available field types
* @param TEXT The text type
* @param NUMERIC The number type
* @param TAG The tag type
*/
export type FTFieldType = 'TEXT' | 'NUMERIC' | 'TAG' | string;

/**
* The config response
*/
export type FTConfig = {
  EXTLOAD?: string | null,
  SAFEMODE?: string,
  CONCURRENT_WRITE_MODE?: string,
  NOGC?: string,
  MINPREFIX?: string,
  FORKGC_SLEEP_BEFORE_EXIT?: string,
  MAXDOCTABLESIZE?: string,
  MAXSEARCHRESULTS?: string,
  MAXAGGREGATERESULTS?: string,
  MAXEXPANSIONS?: string,
  MAXPREFIXEXPANSIONS?: string,
  TIMEOUT?: string,
  INDEX_THREADS?: string,
  SEARCH_THREADS?: string,
  FRISOINI?: string | null,
  ON_TIMEOUT?: string,
  GCSCANSIZE?: string,
  MIN_PHONETIC_TERM_LEN?: string,
  GC_POLICY?: string,
  FORK_GC_RUN_INTERVAL?: string,
  FORK_GC_CLEAN_THRESHOLD?: string,
  FORK_GC_RETRY_INTERVAL?: string,
  _MAX_RESULTS_TO_UNSORTED_MODE?: string,
  CURSOR_MAX_IDLE?: string,
  NO_MEM_POOLS?: string,
  PARTIAL_INDEXED_DOCS?: string,
  UPGRADE_INDEX?: string
}

/**
* The info response
*/
export type FTInfo = {
  index_name?: string,
  index_options?: string[],
  index_definition?: {
    key_type?: string,
    prefixes?: string,
    language_field?: string,
    default_score?: string,
    score_field?: string,
    payload_field?: string
  },
  fields?: string[],
  num_docs?: string,
  max_doc_id?: string,
  num_terms?: string,
  num_records?: string,
  inverted_sz_mb?: string,
  total_inverted_index_blocks?: string,
  offset_vectors_sz_mb?: string,
  doc_table_size_mb?: string,
  sortable_values_size_mb?: string,
  key_table_size_mb?: string,
  records_per_doc_avg?: string,
  bytes_per_record_avg?: string,
  offsets_per_term_avg?: string,
  offset_bits_per_record_avg?: string,
  hash_indexing_failures?: string,
  indexing?: string,
  percent_indexed?: string,
  gc_stats?: {
    bytes_collected?: string,
    total_ms_run?: string,
    total_cycles?: string,
    average_cycle_time_ms?: string,
    last_run_time_ms?: string,
    gc_numeric_trees_missed?: string,
    gc_blocks_denied?: string
  },
  cursor_stats?: {
    global_idle?: number,
    global_total?: number,
    index_capacity?: number,
    index_total?: number
  }
}


export default redissearch
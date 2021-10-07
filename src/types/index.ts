import { Knex } from 'knex'
import SchemaBuilder = Knex.SchemaBuilder
import CreateTableBuilder = Knex.CreateTableBuilder
import { Model } from '../entities/Model'

export type driverType = 'sqlite3' | 'mariadb'

export interface Table extends CreateTableBuilder {}

export interface Schema {
  createTable (tableName: string, callback: (table: Table) => void): void
  dropTableIfExists (tableName: string): SchemaBuilder | undefined
}

export interface KnexClient {
  schema: SchemaBuilder
  raw (query: string): Promise<unknown[]>
}

export type TypeResolvable = string | boolean | number

export interface Registry {}

export type ObjectResolvable = { [K in string]: TypeResolvable }

type UnwrapArrayMember<T> = T extends (infer M)[] ? M : T

declare namespace DeferredKeySelection {
  type AddUnionMember<TSelection, T> = TSelection extends DeferredKeySelection<infer TBase, infer TKeys, infer THasSelect, infer TAliasMapping, infer TSingle, infer TIntersectProps, infer TUnionProps>
    ? DeferredKeySelection<TBase, TKeys, THasSelect, TAliasMapping, TSingle, TIntersectProps, TUnionProps | T>
    : DeferredKeySelection<TSelection, never, false, {}, false, {}, T>;
}

type DeferredKeySelection<TBase, TKeys extends string, THasSelect extends true | false = false, TAliasMapping extends {} = {}, TSingle extends boolean = false, TIntersectProps extends {} = {}, TUnionProps = never> = {
  _base: TBase;
  _hasSelection: THasSelect;
  _keys: TKeys;
  _aliases: TAliasMapping;
  _single: TSingle;
  _intersectProps: TIntersectProps;
  _unionProps: TUnionProps;
}

export type OutputBuffer = ArrayLike<number>
export type InputBuffer = ArrayLike<number>

export type KnexQueryBuilder<TRecord extends {} = any, TResult = any> = {
  select: Knex.Select<TRecord, TResult>
  as: Knex.As<TRecord, TResult>
  columns: Knex.Select<TRecord, TResult>
  column: Knex.Select<TRecord, TResult>
  hintComment: Knex.HintComment<TRecord, TResult>
  from: Knex.Table<TRecord, TResult>
  into: Knex.Table<TRecord, TResult>
  table: Knex.Table<TRecord, TResult>
  distinct: Knex.Distinct<TRecord, TResult>
  distinctOn: Knex.DistinctOn<TRecord, TResult>

  join: Knex.Join<TRecord, TResult>
  joinRaw: Knex.JoinRaw<TRecord, TResult>
  innerJoin: Knex.Join<TRecord, TResult>
  leftJoin: Knex.Join<TRecord, TResult>
  leftOuterJoin: Knex.Join<TRecord, TResult>
  rightJoin: Knex.Join<TRecord, TResult>
  rightOuterJoin: Knex.Join<TRecord, TResult>
  outerJoin: Knex.Join<TRecord, TResult>
  fullOuterJoin: Knex.Join<TRecord, TResult>
  crossJoin: Knex.Join<TRecord, TResult>

  with: Knex.With<TRecord, TResult>
  withRecursive: Knex.With<TRecord, TResult>
  withRaw: Knex.WithRaw<TRecord, TResult>
  withSchema: Knex.WithSchema<TRecord, TResult>
  withWrapped: Knex.WithWrapped<TRecord, TResult>

  andWhere: Knex.Where<TRecord, TResult>
  orWhere: Knex.Where<TRecord, TResult>
  whereNot: Knex.Where<TRecord, TResult>
  andWhereNot: Knex.Where<TRecord, TResult>
  orWhereNot: Knex.Where<TRecord, TResult>
  whereRaw: Knex.WhereRaw<TRecord, TResult>
  orWhereRaw: Knex.WhereRaw<TRecord, TResult>
  andWhereRaw: Knex.WhereRaw<TRecord, TResult>
  whereWrapped: Knex.WhereWrapped<TRecord, TResult>
  havingWrapped: Knex.WhereWrapped<TRecord, TResult>
  whereExists: Knex.WhereExists<TRecord, TResult>
  orWhereExists: Knex.WhereExists<TRecord, TResult>
  whereNotExists: Knex.WhereExists<TRecord, TResult>
  orWhereNotExists: Knex.WhereExists<TRecord, TResult>
  whereIn: Knex.WhereIn<TRecord, TResult>
  orWhereIn: Knex.WhereIn<TRecord, TResult>
  whereNotIn: Knex.WhereIn<TRecord, TResult>
  orWhereNotIn: Knex.WhereIn<TRecord, TResult>
  whereNull: Knex.WhereNull<TRecord, TResult>
  orWhereNull: Knex.WhereNull<TRecord, TResult>
  whereNotNull: Knex.WhereNull<TRecord, TResult>
  orWhereNotNull: Knex.WhereNull<TRecord, TResult>
  whereBetween: Knex.WhereBetween<TRecord, TResult>
  orWhereBetween: Knex.WhereBetween<TRecord, TResult>
  andWhereBetween: Knex.WhereBetween<TRecord, TResult>
  whereNotBetween: Knex.WhereBetween<TRecord, TResult>
  orWhereNotBetween: Knex.WhereBetween<TRecord, TResult>
  andWhereNotBetween: Knex.WhereBetween<TRecord, TResult>

  groupBy: Knex.GroupBy<TRecord, TResult>
  groupByRaw: Knex.RawQueryBuilder<TRecord, TResult>

  orderBy: Knex.OrderBy<TRecord, TResult>
  orderByRaw: Knex.RawQueryBuilder<TRecord, TResult>

  partitionBy: Knex.PartitionBy<TRecord, TResult>

  intersect: Knex.Intersect<TRecord, TResult>

  union: Knex.Union<TRecord, TResult>
  unionAll: Knex.Union<TRecord, TResult>

  having: Knex.Having<TRecord, TResult>
  andHaving: Knex.Having<TRecord, TResult>
  havingRaw: Knex.RawQueryBuilder<TRecord, TResult>
  orHaving: Knex.Having<TRecord, TResult>
  orHavingRaw: Knex.RawQueryBuilder<TRecord, TResult>
  havingIn: Knex.HavingRange<TRecord, TResult>
  orHavingNotBetween: Knex.HavingRange<TRecord, TResult>
  havingNotBetween: Knex.HavingRange<TRecord, TResult>
  orHavingBetween: Knex.HavingRange<TRecord, TResult>
  havingBetween: Knex.HavingRange<TRecord, TResult>
  havingNotIn: Knex.HavingRange<TRecord, TResult>
  andHavingNotIn: Knex.HavingRange<TRecord, TResult>
  orHavingNotIn: Knex.HavingRange<TRecord, TResult>

  clearSelect(): Knex.QueryBuilder<TRecord, UnwrapArrayMember<TResult> extends DeferredKeySelection<infer TBase, infer TKeys, true, any, any, any, any> ? DeferredKeySelection<TBase, never>[] : TResult>
  clearWhere(): Knex.QueryBuilder<TRecord, TResult>
  clearGroup(): Knex.QueryBuilder<TRecord, TResult>
  clearOrder(): Knex.QueryBuilder<TRecord, TResult>
  clearHaving(): Knex.QueryBuilder<TRecord, TResult>
  clearCounters(): Knex.QueryBuilder<TRecord, TResult>
  clear(statement: Knex.ClearStatements): Knex.QueryBuilder<TRecord, TResult>

  offset(offset: number): Knex.QueryBuilder<TRecord, TResult>
  limit(limit: number): Knex.QueryBuilder<TRecord, TResult>

  count: Knex.AsymmetricAggregation<TRecord, TResult, Knex.Lookup<Registry, "Count", number | string>>
  countDistinct: Knex.AsymmetricAggregation<TRecord, TResult, Knex.Lookup<Registry, "Count", number | string>>
  min: Knex.TypePreservingAggregation<TRecord, TResult>
  max: Knex.TypePreservingAggregation<TRecord, TResult>
  sum: Knex.TypePreservingAggregation<TRecord, TResult>
  sumDistinct: Knex.TypePreservingAggregation<TRecord, TResult>
  avg: Knex.TypePreservingAggregation<TRecord, TResult>
  avgDistinct: Knex.TypePreservingAggregation<TRecord, TResult>

  increment( columnName: keyof TRecord, amount?: number ): Knex.QueryBuilder<TRecord, number>
  increment( columnName: string, amount?: number ): Knex.QueryBuilder<TRecord, number>

  decrement( columnName: keyof TRecord, amount?: number ): Knex.QueryBuilder<TRecord, number>
  decrement( columnName: string, amount?: number ): Knex.QueryBuilder<TRecord, number>

  rank: Knex.AnalyticFunction<TRecord, TResult>
  denseRank: Knex.AnalyticFunction<TRecord, TResult>
  rowNumber: Knex.AnalyticFunction<TRecord, TResult>

  first: Knex.Select<TRecord, DeferredKeySelection.AddUnionMember<UnwrapArrayMember<TResult>, undefined>>

  truncate(): Knex.QueryBuilder<TRecord, void>
}
export type RelationOptions = {
  localKey: string
  relationKey: string
}

type RelationResolvable = {
  model: typeof Model,
  options: RelationOptions
}

export type Relations = {
  hasMany: Map<string, RelationResolvable>
  belongTo: Map<string, RelationResolvable>
}


import { Document, FilterQuery, Model, Schema } from 'mongoose';

interface QueryOptions {
  sortBy?: string;
  populate?: string;
  limit?: number;
  page?: number;
}

interface QueryResult<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

const paginate = <T extends Document>(schema: Schema<T>) => {
  schema.statics.paginate = async function (
    filter: FilterQuery<T> = {},
    options: QueryOptions = {}
  ): Promise<QueryResult<T>> {
    let sort = '';
    if (options.sortBy) {
      const sortingCriteria: string[] = [];
      options.sortBy.split(',').forEach((sortOption) => {
        const [key, order] = sortOption.split(':');
        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = 'createdAt';
    }

    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const page = options.page && options.page > 0 ? options.page : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

    if (options.populate) {
      options.populate.split(',').forEach((populateOption) => {
        docsPromise = docsPromise.populate(
          populateOption
            .split('.')
            .reverse()
            .reduce((a, b) => ({ path: b, populate: a }), {})
        );
      });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result: QueryResult<T> = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

export default paginate;
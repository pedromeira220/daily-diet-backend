import { createReadStream, readFileSync } from 'node:fs';
import { basename, dirname, extname } from 'node:path';
import { Readable } from 'node:stream';
import { Path } from './path';

interface FileProps {
  /** Name of the form field associated with this file. */
  fieldname: string;
  /** Name of the file on the uploader's computer. */
  originalname: string;
  /**
   * Value of the `Content-Transfer-Encoding` header for this file.
   * @deprecated since July 2015
   * @see RFC 7578, Section 4.7
   */
  encoding: string;
  /** Value of the `Content-Type` header for this file. */
  mimetype: string;
  /** Size of the file in bytes. */
  size: number;
  /**
   * A readable stream of this file. Only available to the `_handleFile`
   * callback for custom `StorageEngine`s.
   */
  stream: Readable;
  /** `DiskStorage` only: Directory to which this file has been uploaded. */
  destination: string;
  /** `DiskStorage` only: Name of this file within `destination`. */
  filename: string;
  /** `DiskStorage` only: Full path to the uploaded file. */
  path: string;
  /** `MemoryStorage` only: A Buffer containing the entire file. */
  buffer: Buffer;
}

export class File implements FileProps {
  private props: FileProps;

  get fieldname() {
    return this.props.fieldname;
  }

  get originalname() {
    return this.props.originalname;
  }

  get encoding() {
    return this.props.encoding;
  }

  get mimetype() {
    return this.props.mimetype;
  }

  get size() {
    return this.props.size;
  }

  get stream() {
    return this.props.stream;
  }

  get destination() {
    return this.props.destination;
  }

  get filename() {
    return this.props.filename;
  }

  get path() {
    return this.props.path;
  }

  get buffer() {
    return this.props.buffer;
  }

  get extension() {
    return extname(this.originalname);
  }

  private constructor(props: FileProps) {
    this.props = props;
  }

  public static fromExpressFile(expressFile: Express.Multer.File) {
    const instance = new File(expressFile);

    return instance;
  }

  public static fromPath(path: Path) {
    try {
      const fileBuffer = readFileSync(path.toString());
      const fileProps: FileProps = {
        fieldname: '',
        originalname: path.lastPath,
        encoding: '',
        mimetype: '',
        size: fileBuffer.length,
        stream: createReadStream(path.toString()),
        destination: dirname(path.toString()),
        filename: basename(path.toString()),
        path: path.toString(),
        buffer: fileBuffer,
      };

      return new File(fileProps);
    } catch (error) {
      console.error('> Error reading file:', error);
      throw error;
    }
  }
}

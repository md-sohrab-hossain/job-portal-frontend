import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { RequestError } from "./errors";

function formatError(
  statusCode: number,
  message: string,
  details?: Record<string, string[]>,
) {
  return {
    success: false,
    statusCode,
    message,
    ...(details && { details }),
  };
}

export function handleError(error: unknown) {
  if (error instanceof RequestError) {
    return NextResponse.json(
      formatError(error.statusCode, error.message, error.errors),
      { status: error.statusCode },
    );
  }

  if (error instanceof ZodError) {
    const errors = error.flatten().fieldErrors as Record<string, string[]>;
    return NextResponse.json(formatError(400, "Validation failed", errors), {
      status: 400,
    });
  }

  // TODO: Re-hide this in final production for security
  const message =
    error instanceof Error ? error.message : "Internal server error";

  return NextResponse.json(formatError(500, message), { status: 500 });
}

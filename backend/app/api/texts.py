from __future__ import annotations

from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
import io
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.auth import get_current_user
from app.schemas.auth import UserResponse
from app.services.text_processing import (
    normalize_text,
    anonymize_text,
    apply_template,
    extract_text_from_pdf,
    extract_text_from_docx,
    generate_docx_bytes,
)


router = APIRouter()


@router.post("/normalize")
async def normalize(
    content: str = Form(...),
    template: Optional[str] = Form(None),
    anonymize: bool = Form(False),
    tribunal: Optional[str] = Form(None),
    comarca: Optional[str] = Form(None),
    processo: Optional[str] = Form(None),
    local_data: Optional[str] = Form(None),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    text = normalize_text(content)
    if anonymize:
        text = anonymize_text(text)
    meta = {"tribunal": tribunal or "", "comarca": comarca or "", "processo": processo or "", "local_data": local_data or ""}
    result = apply_template(template, text, meta)
    return {"content": result}


@router.post("/extract")
async def extract(
    file: UploadFile = File(...),
    anonymize: bool = Form(False),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    filename = (file.filename or "").lower()
    content_bytes = await file.read()
    if filename.endswith(".pdf"):
        text = extract_text_from_pdf(content_bytes)
    elif filename.endswith(".docx"):
        text = extract_text_from_docx(content_bytes)
    else:
        raise HTTPException(status_code=400, detail="Formato não suportado. Envie PDF ou DOCX.")
    text = normalize_text(text)
    if anonymize:
        text = anonymize_text(text)
    return {"content": text}


@router.post("/compare")
async def compare(
    left: str = Form(...),
    right: str = Form(...),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    # Very simple diff: line-based
    left_lines = normalize_text(left).split("\n")
    right_lines = normalize_text(right).split("\n")
    additions = []
    removals = []
    max_len = max(len(left_lines), len(right_lines))
    for i in range(max_len):
        l = left_lines[i] if i < len(left_lines) else ""
        r = right_lines[i] if i < len(right_lines) else ""
        if l != r:
            if l:
                removals.append({"line": i + 1, "text": l})
            if r:
                additions.append({"line": i + 1, "text": r})
    return {"additions": additions, "removals": removals}


@router.post("/export/docx")
async def export_docx(
    content: str = Form(...),
    title: Optional[str] = Form(None),
    tribunal: Optional[str] = Form(None),
    comarca: Optional[str] = Form(None),
    processo: Optional[str] = Form(None),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> StreamingResponse:
    meta = {"tribunal": tribunal or "", "comarca": comarca or "", "processo": processo or ""}
    bytes_out = generate_docx_bytes(title, content, meta)
    return StreamingResponse(
        io.BytesIO(bytes_out),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": "attachment; filename=documento.docx"},
    )



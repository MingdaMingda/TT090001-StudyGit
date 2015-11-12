#!/usr/bin/env python
# -*- coding: UTF-8 -*-

from whoosh.index import create_in
from whoosh.fields import *
from whoosh.analysis import RegexAnalyzer

from whoosh.analysis import Tokenizer,Token

import jieba

class ChineseTokenizer(Tokenizer):
    def __call__(self, value, positions=False, chars=False,
                 keeporiginal=False, removestops=True,
                 start_pos=0, start_char=0, mode='', **kwargs):
        assert isinstance(value, text_type), "%r is not unicode" % value
        t = Token(positions, chars, removestops=removestops, mode=mode,
            **kwargs)
        seglist=jieba.cut(value,cut_all=False)                       
        for w in seglist:
            t.original = t.text = w
            t.boost = 1.0
            if positions:
                t.pos=start_pos+value.find(w)
            if chars:
                t.startchar=start_char+value.find(w)
                t.endchar=start_char+value.find(w)+len(w)
            yield t                                               

def ChineseAnalyzer():
    return ChineseTokenizer()

#analyzer = RegexAnalyzer(ur"([\u4e00-\u9fa5])|(\w+(\.?\w+)*)")
analyzer=ChineseAnalyzer()
schema = Schema(title=TEXT(stored=True), path=ID(stored=True), content=TEXT(stored=True, analyzer=analyzer))
ix = create_in("indexdir", schema)
writer = ix.writer()
writer.add_document(title=u"First document", path=u"/a",
content=u"This is the first document we’ve added!")
writer.add_document(title=u"Second document", path=u"/b",
content=u"The second one 你 中文测试中文 is even more interesting!")
writer.commit()
searcher = ix.searcher()
results = searcher.find("content", u"first")
print results[0].highlights("content").encode('utf-8')
results = searcher.find("content", u"你")
print results[0].highlights("content").encode('utf-8')
results = searcher.find("content", u"测试")
print results[0].highlights("content").encode('utf-8')

